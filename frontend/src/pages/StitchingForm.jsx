import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, Camera, ArrowLeft, Trash2 } from 'lucide-react';
import api from '../lib/api';

const defaultMeasurements = [
    { name: "Chest", value: "" },
    { name: "Length", value: "" },
    { name: "Kurti Length", value: "" },
    { name: "Sleeve Length", value: "" },
    { name: "Sleeve width", value: "" },
    { name: "Hip", value: "" }
];

const StitchingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    
    // Measurement states
    const [showMeasurements, setShowMeasurements] = useState(false);
    const [measurements, setMeasurements] = useState(defaultMeasurements);

    const [formData, setFormData] = useState({
        customerName: '',
        clothType: '',
        billNumber: '',
        phoneNumber: '',
        remark: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        amount: '',
        status: 'pending',
        measurementsGlobalUnit: 'inch'
    });

    useEffect(() => {
        if (isEditMode) {
            fetchRecord();
        }
    }, [id]);

    const fetchRecord = async () => {
        try {
            const res = await api.get(`/stitching/${id}`);
            const data = res.data.data;
            setFormData({
                ...data,
                orderDate: data.orderDate ? data.orderDate.split('T')[0] : '',
                deliveryDate: data.deliveryDate ? data.deliveryDate.split('T')[0] : '',
                measurementsGlobalUnit: data.measurementsGlobalUnit || 'inch'
            });
            if (data.imageUrl) setImagePreview(data.imageUrl);

            if (data.measurements && data.measurements.length > 0) {
                setShowMeasurements(true);
                const dbMeasurements = data.measurements;
                const mergedMap = new Map();
                defaultMeasurements.forEach(m => mergedMap.set(m.name, m.value));
                dbMeasurements.forEach(m => mergedMap.set(m.name, m.value));
                
                const mergedArray = Array.from(mergedMap, ([name, value]) => ({ name, value }));
                setMeasurements(mergedArray);
            }
        } catch (error) {
            console.error('Failed to fetch record', error);
            navigate('/dashboard/stitching');
        }
    };

    const handleMeasurementChange = (index, value) => {
        const updated = [...measurements];
        updated[index].value = value;
        setMeasurements(updated);
    };

    const handleCustomMeasurementAdd = () => {
        const name = window.prompt("Enter new measurement name (e.g. Shoulder, Neck)");
        if (name && name.trim() !== "") {
            setMeasurements([...measurements, { name: name.trim(), value: "" }]);
        }
    };

    const handleRemoveMeasurement = (index) => {
        const updated = measurements.filter((_, i) => i !== index);
        setMeasurements(updated);
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
            if (key !== 'imageUrl' && key !== 'imagePublicId' && key !== 'measurements') {
                data.append(key, formData[key]);
            }
        });

        if (selectedImage) {
            data.append('image', selectedImage);
        } else if (imagePreview === '') {
            data.append('imageUrl', '');
        }

        if (showMeasurements) {
            const validMeasurements = measurements.filter(m => m.value.trim() !== "");
            data.append('measurements', JSON.stringify(validMeasurements));
        } else {
            data.append('measurements', JSON.stringify([]));
        }

        try {
            if (isEditMode) {
                await api.put(`/stitching/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/stitching', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            navigate('/dashboard/stitching');
        } catch (error) {
            console.error('Save failed', error);
            alert(error.response?.data?.message || 'Failed to save record');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        setIsLoading(true);
        try {
            await api.delete(`/stitching/${id}`);
            navigate('/dashboard/stitching');
        } catch (error) {
            console.error('Delete failed', error);
            alert("Failed to delete record");
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 pb-24">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">
                        {isEditMode ? 'Edit Order' : 'New Order'}
                    </h2>
                </div>
                {isEditMode && (
                    <button type="button" onClick={handleDelete} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors" title="Delete record">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload Area */}
                <div className="card border-dashed flex flex-col items-center justify-center p-8 bg-card/50 relative overflow-hidden group">
                    {imagePreview ? (
                        <div className="absolute inset-0">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium flex items-center gap-2"><Camera className="w-5 h-5" /> Change Photo</span>
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
                            <span className="font-medium">Tap to add a photo/cloth</span>
                        </div>
                    )}
                    <input
                        type="file" accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageSelect}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Customer Name *</label>
                        <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Phone Number *</label>
                        <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input-field" placeholder="9876543210" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Cloth Type/Item *</label>
                        <input type="text" name="clothType" value={formData.clothType} onChange={handleChange} className="input-field border-primary/50" placeholder="Poshak, Suit..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Amount (₹) *</label>
                        <input required type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" className="input-field font-semibold text-lg text-primary" placeholder="0.00" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Order Date *</label>
                        <input required type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Delivery Date</label>
                        <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="input-field" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Bill Number</label>
                        <input type="text" name="billNumber" value={formData.billNumber || ''} onChange={handleChange} className="input-field" placeholder="Optional" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                            <option value="pending">Pending</option>
                            <option value="completed">Completed (Ready to deliver)</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>

                {/* Measurements Toggle Panel */}
                <div className="sm:col-span-2 space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Measurements</h3>
                            <p className="text-sm text-foreground/50">Optional fitting details</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={showMeasurements}
                                onChange={() => setShowMeasurements(!showMeasurements)}
                            />
                            <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {showMeasurements && (
                        <div className="card bg-foreground/5 border-none p-4 space-y-4">
                            <div className="flex justify-end mb-2">
                                <div className="inline-flex bg-card rounded-lg p-1 border border-border text-xs font-semibold">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, measurementsGlobalUnit: 'inch'})} 
                                        className={`px-3 py-1 rounded-md transition-colors ${formData.measurementsGlobalUnit === 'inch' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70'}`}
                                    >Inch</button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, measurementsGlobalUnit: 'cm'})} 
                                        className={`px-3 py-1 rounded-md transition-colors ${formData.measurementsGlobalUnit === 'cm' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70'}`}
                                    >cm</button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {measurements.map((m, idx) => (
                                    <div key={idx} className="relative">
                                        <label className="text-xs font-semibold text-foreground/70 pl-1 capitalize line-clamp-1 pr-6">{m.name}</label>
                                        <div className="relative mt-1">
                                            <input 
                                                type="number" 
                                                value={m.value}
                                                onChange={(e) => handleMeasurementChange(idx, e.target.value)}
                                                className="input-field pr-10" 
                                                placeholder="0" 
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/30 uppercase">{formData.measurementsGlobalUnit}</span>
                                        </div>
                                        {idx >= defaultMeasurements.length && (
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveMeasurement(idx)}
                                                className="absolute -top-1 right-0 text-red-500 hover:text-red-700 p-1 bg-card rounded-full shadow-sm border border-border/50"
                                                title="Remove custom measurement"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button 
                                type="button" 
                                onClick={handleCustomMeasurementAdd}
                                className="w-full mt-2 py-3 rounded-xl border border-dashed border-primary/40 text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                + Add Custom Measurement
                            </button>
                        </div>
                    )}
                </div>

                    <div className="space-y-1 sm:col-span-2 mt-4 pt-4 border-t border-border">
                        <label className="text-sm font-medium text-foreground/80 pl-1">Remarks</label>
                        <textarea name="remark" value={formData.remark || ''} onChange={handleChange} className="input-field min-h-24 resize-none" placeholder="Measurements or additional notes..." />
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-semibold bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isEditMode ? 'Update Order' : 'Save Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StitchingForm;
