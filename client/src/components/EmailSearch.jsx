import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, User, Mail, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from './Navbar';

const EmailSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    sender: '',
    recipient: '',
    size: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/email/');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        ...filters,
        page,
        limit: 10
      });

      const response = await fetch(`/api/email/search?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.emails);
        setTotalPages(Math.ceil(data.total / 10));
        setTotalResults(data.total);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error searching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      dateFrom: '',
      dateTo: '',
      sender: '',
      recipient: '',
      size: '',
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  };

  return (
    <div className='min-h-screen bg-gray-100' >
      <Navbar />
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              ค้นหาอีเมล
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              ตัวกรอง
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="ค้นหาข้อความในอีเมล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => handleSearch(1)} disabled={loading}>
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    หมวดหมู่
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => {
                      setFilters(prev => ({ ...prev, category: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.categoryID} value={category.categoryID.toString()}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    ช่วงวันที่
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ผู้ส่ง
                  </label>
                  <Input
                    placeholder="อีเมลผู้ส่ง"
                    value={filters.sender}
                    onChange={(e) => setFilters(prev => ({ ...prev, sender: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    ผู้รับ
                  </label>
                  <Input
                    placeholder="อีเมลผู้รับ"
                    value={filters.recipient}
                    onChange={(e) => setFilters(prev => ({ ...prev, recipient: e.target.value }))}
                  />
                </div>

                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>ผลการค้นหา ({totalResults} รายการ)</div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  หน้า {currentPage} จาก {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((email) => (
                <div
                  key={email.emailID}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <div className="font-medium">{email.senderEmail}</div>
                      <div className="text-sm text-gray-500">ถึง: {email.recipientEmail}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(email.date)}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{email.message}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {formatSize(email.size)}
                    </Badge>
                    {email.categoryName && (
                      <Badge>
                        {email.categoryName}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 && !loading && searchQuery && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            ไม่พบผลการค้นหา
          </CardContent>
        </Card>
      )}
    </div>
    </div>

  );
};

export default EmailSearch;