
import React, { useEffect, useRef } from 'react';
import type { TarotCard } from '../types';

interface ModalProps {
    card: TarotCard;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ card, onClose }) => {
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Close modal on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Close modal on outside click
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleOutsideClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                ref={modalContentRef} 
                className="bg-brand-card-bg border border-brand-accent rounded-lg shadow-2xl shadow-brand-accent/20 w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 text-brand-fg animate-fade-in"
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-brand-muted hover:text-brand-accent text-3xl font-bold transition-colors"
                    aria-label="Close"
                >
                    &times;
                </button>
                
                <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full max-w-[300px] rounded-lg block mx-auto mb-5 border-2 border-brand-accent/50"
                />
                
                <h2 id="modal-title" className="font-cinzel text-brand-accent text-center text-3xl mb-2">
                    {card.name}
                </h2>
                
                <h3 className="text-center italic text-brand-muted text-lg mb-6">
                    {card.keyword}
                </h3>

                <div className="space-y-5 text-lg leading-relaxed">
                    <p><em>{card.desc_general}</em></p>
                    
                    <div>
                        <h4 className="font-cinzel text-brand-accent border-b border-brand-accent/30 pb-2 mb-2 font-semibold text-xl">❤️ Отношения</h4>
                        <p>{card.desc_love}</p>
                    </div>

                    <div>
                        <h4 className="font-cinzel text-brand-accent border-b border-brand-accent/30 pb-2 mb-2 font-semibold text-xl">💼 Работа и Финансы</h4>
                        <p>{card.desc_work}</p>
                    </div>

                    <div>
                        <h4 className="font-cinzel text-brand-accent border-b border-brand-accent/30 pb-2 mb-2 font-semibold text-xl">🌿 Здоровье</h4>
                        <p>{card.desc_health}</p>
                    </div>

                    <div>
                        <h4 className="font-cinzel text-brand-accent border-b border-brand-accent/30 pb-2 mb-2 font-semibold text-xl">🧘‍♂️ Путь к себе</h4>
                        <p>{card.desc_path}</p>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;
