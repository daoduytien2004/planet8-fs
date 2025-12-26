import { useState } from 'react';
import quizApi from '../../apis/quizApi';
import { showToast } from '../ui/Toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // User will need to add this
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // User will need to add this
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // User will need to add this
import { ChevronLeft, Plus, Save, Trash2, CheckCircle2 } from "lucide-react";

const QuestionManager = ({ quiz, onBack }) => {
    const [questions, setQuestions] = useState([]); // In a real app, fetch existing questions here
    const [isAdding, setIsAdding] = useState(true);
    const [loading, setLoading] = useState(false);

    const [newQuestion, setNewQuestion] = useState({
        content: '',
        mediaUrl: '',
        options: [
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false }
        ]
    });

    // Helper to find index of correct option
    const correctOptionIndex = newQuestion.options.findIndex(o => o.isCorrect);
    const correctValue = correctOptionIndex >= 0 ? correctOptionIndex.toString() : "";

    const handleCorrectChange = (value) => {
        const index = parseInt(value);
        const updatedOptions = newQuestion.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index
        }));
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleOptionContentChange = (index, content) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = { ...updatedOptions[index], content };
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.content) return showToast('Vui lòng nhập nội dung câu hỏi', 'warning');
        if (!newQuestion.options.some(o => o.isCorrect)) return showToast('Vui lòng chọn đáp án đúng', 'warning');
        if (newQuestion.options.some(o => !o.content)) return showToast('Vui lòng nhập đầy đủ nội dung các lựa chọn', 'warning');

        setLoading(true);
        try {
            await quizApi.addQuestions(quiz.id, {
                questions: [newQuestion]
            });
            showToast('Thêm câu hỏi thành công', 'success');
            setNewQuestion({
                content: '',
                mediaUrl: '',
                options: [
                    { content: '', isCorrect: false },
                    { content: '', isCorrect: false },
                    { content: '', isCorrect: false },
                    { content: '', isCorrect: false }
                ]
            });
            // Ideally refresh list here
        } catch (error) {
            console.error('Error adding question:', error);
            showToast('Thêm câu hỏi thất bại', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 container mx-auto p-6 max-w-4xl">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Quản Lý Câu Hỏi</h2>
                        <p className="text-muted-foreground">
                            Quiz: <span className="font-semibold text-primary">{quiz.title}</span>
                        </p>
                    </div>
                </div>
                <Button variant="secondary" disabled>
                    {questions.length} Câu hỏi hiện có
                </Button>
            </div>

            {/* Add Question Form */}
            <Card className="border-indigo-500/20 shadow-lg">
                <CardHeader>
                    <CardTitle>Thêm Câu Hỏi Mới</CardTitle>
                    <CardDescription>
                        Nhập nội dung câu hỏi và các lựa chọn. Đừng quên chọn đáp án đúng.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Question Content */}
                    <div className="space-y-2">
                        <Label htmlFor="q-content">Nội dung câu hỏi</Label>
                        <Textarea
                            id="q-content"
                            placeholder="Nhập câu hỏi của bạn ở đây..."
                            value={newQuestion.content}
                            onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Media URL */}
                    <div className="space-y-2">
                        <Label htmlFor="q-media">Link Ảnh/Video (Tùy chọn)</Label>
                        <Input
                            id="q-media"
                            placeholder="https://example.com/image.png"
                            value={newQuestion.mediaUrl}
                            onChange={(e) => setNewQuestion({ ...newQuestion, mediaUrl: e.target.value })}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <Label>Các lựa chọn trả lời</Label>
                        <RadioGroup value={correctValue} onValueChange={handleCorrectChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newQuestion.options.map((option, index) => (
                                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${option.isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-input'}`}>
                                    <RadioGroupItem value={index.toString()} id={`opt-${index}`} className="data-[state=checked]:border-green-500 data-[state=checked]:text-green-500" />
                                    <div className="flex-1">
                                        <Input
                                            placeholder={`Lựa chọn ${index + 1}`}
                                            value={option.content}
                                            onChange={(e) => handleOptionContentChange(index, e.target.value)}
                                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-1 shadow-none"
                                        />
                                    </div>
                                    {option.isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onBack}>Hủy bỏ</Button>
                    <Button onClick={handleAddQuestion} disabled={loading} className="gap-2">
                        <Save className="h-4 w-4" />
                        {loading ? 'Đang lưu...' : 'Lưu Câu Hỏi'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default QuestionManager;
