import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, Camera, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

const DueForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // File object
    const [imagePreview, setImagePreview] = useState(''); // Local object URL or remote URL
    const [formData, setFormData] = useState({
        name: '',
        item: '',
        billNumber: '',
        phoneNumber: '',
        remark: '',
        dueDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: '',
        amount: '',
        status: 'pending' // pending by default
    });

    useEffect(() => {
        if (isEditMode) {
            fetchDue();
        }
    }, [id]);

    const fetchDue = async () => {
        try {
            const res = await api.get(`/dues/${id}`);
            const data = res.data.data;
            setFormData({
                ...data,
                dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
                expectedReturnDate: data.expectedReturnDate ? data.expectedReturnDate.split('T')[0] : ''
            });
            if (data.imageUrl) {
                setImagePreview(data.imageUrl);
            }
        } catch (error) {
            console.error('Failed to fetch due', error);
            navigate('/dashboard/dues');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImage(null);
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'imageUrl' && key !== 'imagePublicId') {
                data.append(key, formData[key]);
            }
        });
        
        if (selectedImage) {
            data.append('image', selectedImage);
        } else if (imagePreview === '') {
            // Explicitly pass empty to signal backend to delete existing image securely
            data.append('imageUrl', '');
        }

        try {
            if (isEditMode) {
                await api.put(`/dues/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
            } else {
                await api.post('/dues', data, { headers: { 'Content-Type': 'multipart/form-data' }});
            }
            navigate('/dashboard/dues');
        } catch (error) {
            console.error('Save failed', error);
            alert(error.response?.data?.message || 'Failed to save due');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 pb-24">
            <div className="mb-6 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {isEditMode ? 'Edit Due' : 'Add New Due'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div className="card border-dashed flex flex-col items-center justify-center p-8 bg-card/50 relative overflow-hidden group">
                    {imagePreview ? (
                        <div className="absolute inset-0">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium flex items-center gap-2"><Camera className="w-5 h-5"/> Change Photo</span>
                            </div>
                            <button 
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-foreground/50 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <span className="font-medium">Tap to add a photo/bill</span>
                            <span className="text-xs opacity-70 mt-1">Optional (stored safely on server)</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleImageSelect}
                        title="Choose photo"
                    />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Customer Name *</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Phone Number *</label>
                        <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input-field" placeholder="9876543210" />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Amount (₹) *</label>
                        <input required type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" className="input-field font-semibold text-lg text-primary" placeholder="0.00" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Item Purchased</label>
                        <input type="text" name="item" value={formData.item || ''} onChange={handleChange} className="input-field" placeholder="Groceries, Hardware, etc." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Bill Number</label>
                        <input type="text" name="billNumber" value={formData.billNumber || ''} onChange={handleChange} className="input-field" placeholder="Optional" />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Due Date *</label>
                        <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Expected Return Date</label>
                        <input type="date" name="expectedReturnDate" value={formData.expectedReturnDate} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Remarks</label>
                        <textarea name="remark" value={formData.remark || ''} onChange={handleChange} className="input-field min-h-24 resize-none" placeholder="Any additional notes..." />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isEditMode ? 'Update Due' : 'Save Due'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DueForm;
