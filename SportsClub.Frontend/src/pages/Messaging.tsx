import { useEffect, useState } from 'react';
import { messagingService } from '../services/messagingService';
import type { Message } from '../types/messaging';
import { Mail, Send, Inbox, MessageSquare, Check, CheckCheck } from 'lucide-react';

export const Messaging = () => {
    const [inbox, setInbox] = useState<Message[]>([]);
    const [sent, setSent] = useState<Message[]>([]);
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'inbox') {
                    const data = await messagingService.getInbox();
                    setInbox(data);
                } else {
                    const data = await messagingService.getSentMails();
                    setSent(data);
                }
            } catch (error) {
                console.error('Failed to load messages', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
        setSelectedMessage(null);
    }, [activeTab]);

    const handleSelectMessage = async (msg: Message) => {
        setSelectedMessage(msg);
        if (activeTab === 'inbox' && !msg.isRead) {
            try {
                await messagingService.markAsRead(msg.id);
                setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            } catch (error) {
                console.error('Failed to mark as read', error);
            }
        }
    };

    const messages = activeTab === 'inbox' ? inbox : sent;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mesajlaşma (Inbox)</h1>
                            <p className="text-sm text-gray-500">Antrenörler, Veliler ve Yöneticiler arası iletişim platformu.</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 btn bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => alert('Yeni Mesaj Yaz Modal (Yapım Aşamasında)')}>
                        <Send size={16} />
                        <span>Yeni Mesaj</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[700px]">

                    {/* Sidebar / Folders */}
                    <div className="w-full md:w-64 border-r border-gray-100 bg-gray-50 flex flex-col">
                        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
                            Klasörler
                        </div>
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('inbox')}
                                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inbox' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Inbox size={18} />
                                    <span>Gelen Kutusu</span>
                                </div>
                                {activeTab === 'inbox' && inbox.filter(m => !m.isRead).length > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {inbox.filter(m => !m.isRead).length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('sent')}
                                className={`w-full flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sent' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <Send size={18} />
                                <span>Gönderilenler</span>
                            </button>
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="w-full md:w-1/3 border-r border-gray-100 flex flex-col bg-white">
                        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
                            <span>{activeTab === 'inbox' ? 'Gelen Kutusu' : 'Gönderilenler'}</span>
                            <span className="text-xs font-normal text-gray-500">{messages.length} Mesaj</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
                            ) : messages.length === 0 ? (
                                <div className="text-center p-8 text-gray-500 text-sm">
                                    Bu klasörde mesaj bulunmuyor.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {messages.map(msg => (
                                        <button
                                            key={msg.id}
                                            onClick={() => handleSelectMessage(msg)}
                                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-indigo-50/50' : ''} ${!msg.isRead && activeTab === 'inbox' ? 'bg-white' : ''}`}
                                        >
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className={`text-sm truncate pr-2 ${!msg.isRead && activeTab === 'inbox' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {activeTab === 'inbox' ? msg.senderName : msg.receiverName}
                                                </span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(msg.sentAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                            <p className={`text-sm line-clamp-2 ${!msg.isRead && activeTab === 'inbox' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                                {msg.content}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Details */}
                    <div className="flex-1 flex flex-col bg-white">
                        {selectedMessage ? (
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                {(activeTab === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {activeTab === 'inbox' ? selectedMessage.senderName : selectedMessage.receiverName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {activeTab === 'inbox' ? 'Kimden' : 'Kime'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">
                                                {new Date(selectedMessage.sentAt).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {activeTab === 'sent' && (
                                                <div className="text-xs flex items-center justify-end gap-1 mt-1 text-gray-400">
                                                    {selectedMessage.isRead ? <><CheckCheck size={14} className="text-blue-500" /> Okundu</> : <><Check size={14} /> İletildi</>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 overflow-y-auto">
                                    <div className="prose max-w-none text-gray-800 text-sm whitespace-pre-wrap">
                                        {selectedMessage.content}
                                    </div>
                                </div>
                                {activeTab === 'inbox' && (
                                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                                        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => alert('Yanıtla Modal (Yapım Aşamasında)')}>
                                            <Mail size={16} />
                                            <span>Yanıtla</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                                <Mail size={48} className="text-gray-200 mb-4" />
                                <p>Okumak için bir mesaj seçin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
