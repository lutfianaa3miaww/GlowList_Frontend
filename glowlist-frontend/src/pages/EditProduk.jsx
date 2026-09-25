import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
    });
    const [kategori, setKategori] = useState([]);
    const [fileBaru, setFileBaru] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/produk/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData(data[0]); // ambil data pertama hasil query
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [id]);

    useEffect(() => {
        fetch("http://localhost:5000/kategori")
            .then((res) => res.json())
            .then((data) => {
                setKategori(data);
            })
            .catch((err) => console.error("Gagal mengambil kategori:", err));
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fileBaru && fileBaru.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar, maksimal 2MB');
            return;
        }

        if (!window.confirm("Yakin ingin memperbarui produk ini?")) {
            return;
        }

        const data = new FormData();

        data.append("judul", formData.judul);
        data.append("deskripsi", formData.deskripsi);
        data.append("harga", formData.harga);
        data.append("id_kategori", formData.id_kategori);
        if (fileBaru) {
            data.append("file", fileBaru); // hanya kirim kalau ada foto baru
        }

        try {
        const res = await fetch(`http://localhost:5000/produk/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: data,
        });
        if (res.ok) {
            alert("Produk berhasil ditambahkan!");
            navigate("/produk");
        } else {
            const data = await res.json();
            alert(data.message || "Gagal menambahkan produk")
        }
    } catch (err) {
        console.error("Error:, err");
        alert("Terjadi kesalahan saat menambah produk");
    }
    };
    
    if (loading) {
        return <div className="container mt-4">Loading...</div>
    }

    return (
        <div className="container mt-4">
            <h2>Edit Produk</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Judul 𖹭</label>
                    <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi 𖹭</label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan deskripsi produk"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga 𖹭</label>
                    <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan harga"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nama Kategori 𖹭</label>
                    <select
                        name="id_kategori"
                        value={formData.id_kategori}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">--- Pilih Kategori---</option>
                        {kategori.map((k) => (
                            <option key={k.id_kategori} value={k.id_kategori}>
                                {k.kategori}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Foto Saat Ini</label>
                    <div>
                        {formData.nama_file ? (
                            <img
                                src={'http://localhost:5000/uploads/${formData.nama_file}'}
                                alt="Foto lama"
                                style={{ width: "120px", borderRadius: "8px" }}
                            />
                        ) : (
                            <p>Tidak ada foto</p>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Ganti Foto (opsional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFileBaru(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
}