import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import axios from 'axios'


const EmailCategoryForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        messageId: '',
        senderEmail: '',
        recipientEmail: '',
        message: '',
        size: '',
        categoryName: '',
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            generateMessageId();
        }
    }, [isOpen]);

    const generateMessageId = () => {
        const randomNum = Math.floor(Math.random() * 100000000);
        const randomTimestamp = Date.now();
        const messageId = `${randomNum}.${randomTimestamp}.JavaMail.evans@thyme`;

        setFormData(prev => ({
            ...prev,
            messageId
        }));
    };


    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
    
            const response = await axios.get('/api/email/category/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Extract categories from the response
            if (Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            } else {
                throw new Error('Categories data is not an array');
            }
        } catch (err) {
            setError('Failed to load categories');
            console.error(err); // Log the error for more details
        } finally {
            setLoading(false);
        }
    };
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(date);
        return formattedDate.replace(',', '').replace(/\//g, '-'); // Replace slashes with dashes
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const token = sessionStorage.getItem('token');
    
            const response = await axios.post('/api/email/insert', {
                ...formData,
                date: formatDate(new Date()),
                size: parseInt(formData.size),
                categoryID: categories.find(category => category.categoryName === formData.categoryName)?.categoryID
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.success) {
                setSuccess('Email added successfully');
                setFormData({
                    messageId: '',
                    senderEmail: '',
                    recipientEmail: '',
                    message: '',
                    size: '',
                    categoryName: ''
                });
    
                setTimeout(() => {
                    onClose();
                    setSuccess('');
                }, 1500);
            } else {
                throw new Error('Failed to add email');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Email</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to add a new email entry.
                    </DialogDescription>
                </DialogHeader>


                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="messageId">Message ID</Label>
                        <Input
                            id="messageId"
                            name="messageId"
                            value={formData.messageId}
                            onChange={handleChange}
                            required
                            readOnly
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="senderEmail">Sender Email</Label>
                            <Input
                                id="senderEmail"
                                name="senderEmail"
                                type="email"
                                value={formData.senderEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipientEmail">Recipient Email</Label>
                            <Input
                                id="recipientEmail"
                                name="recipientEmail"
                                type="email"
                                value={formData.recipientEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Input
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="size">Size (bytes)</Label>
                            <Input
                                id="size"
                                name="size"
                                type="number"
                                value={formData.size}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Category</Label>
                            <select
                                id="categoryName"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category.categoryID} value={category.categoryName}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Email
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EmailCategoryForm;