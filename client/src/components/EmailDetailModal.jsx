import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Mail, Tag, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const EmailDetailModal = ({ email, onClose, isOpen }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="w-6 h-6" />
            <span>รายละเอียดอีเมล</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            แสดงรายละเอียดข้อความและข้อมูลที่เกี่ยวข้องกับอีเมลนี้
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="p-6 max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Header Information Card */}
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Sender and Date */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {email.senderEmail}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>ถึง:</span> {email.recipientEmail}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground bg-background px-3 py-1.5 rounded-md flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(email.date)}</span>
                    </div>
                  </div>

                  {/* Categories and Size */}
                  <div className="flex flex-wrap gap-2">
                    {email.categoryName && (
                      <Badge variant="outline" className="px-3 py-1">
                        <Tag className="w-4 h-4 mr-2" />
                        {email.categoryName}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="px-3 py-1">
                      <Paperclip className="w-4 h-4 mr-2" />
                      {formatSize(email.size)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Content Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เนื้อหาข้อความ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {email.message}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments Section (if needed) */}
            {email.attachments && email.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ไฟล์แนบ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {email.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="flex-1 truncate">{attachment.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatSize(attachment.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDetailModal;