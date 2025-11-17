
import React, { useEffect, useRef } from 'react';

interface InstallInstructionsModalProps {
    onClose: () => void;
    onInstallClick: () => void;
    installPromptAvailable: boolean;
}

const InstallInstructionsModal: React.FC<InstallInstructionsModalProps> = ({ onClose, onInstallClick, installPromptAvailable }) => {
    const modalContentRef = useRef<HTMLDivElement>(null);

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
            aria-labelledby="install-modal-title"
        >
            <div
                ref={modalContentRef}
                className="bg-brand-card-bg border border-brand-accent rounded-lg shadow-2xl shadow-brand-accent/20 w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 text-brand-fg animate-fade-in"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-brand-muted hover:text-brand-accent text-3xl font-bold transition-colors z-10"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h2 id="install-modal-title" className="font-cinzel text-brand-accent text-center text-3xl mb-6 font-bold tracking-wider">
                    Установить приложение
                </h2>

                <div className="space-y-6 text-lg leading-relaxed font-garamond">
                    <p className="text-center text-brand-muted italic">
                        Добавьте иконку на главный экран для быстрого доступа к энциклопедии в любое время.
                    </p>

                    {installPromptAvailable && (
                         <div className="text-center my-4">
                            <button
                                onClick={onInstallClick}
                                className="inline-block bg-brand-accent border border-brand-accent text-brand-bg font-cinzel py-3 px-8 rounded-lg hover:brightness-110 transition-colors duration-300 text-lg tracking-wider"
                            >
                                ✨ Установить в один клик
                            </button>
                        </div>
                    )}
                    
                    <div className="border-t border-brand-accent/20 my-4"></div>

                    <div>
                        <h4 className="font-cinzel text-brand-accent font-semibold text-xl mb-2">📱 iPhone / iPad (Safari)</h4>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                            <li>Нажмите иконку "Поделиться" (квадрат со стрелкой вверх).</li>
                            <li>Пролистайте вниз и выберите "На экран «Домой»".</li>
                            <li>Нажмите "Добавить".</li>
                        </ol>
                    </div>

                    <div>
                        <h4 className="font-cinzel text-brand-accent font-semibold text-xl mb-2">📱 Android (Chrome)</h4>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                            <li>Нажмите на меню (три точки в углу экрана).</li>
                            <li>Выберите "Установить приложение" или "Добавить на главный экран".</li>
                        </ol>
                    </div>
                    
                    <div>
                        <h4 className="font-cinzel text-brand-accent font-semibold text-xl mb-2">💻 Компьютер (Chrome / Edge)</h4>
                        <ol className="list-decimal list-inside space-y-1 pl-2">
                            <li>В адресной строке справа найдите иконку (монитор со стрелкой).</li>
                            <li>Нажмите на нее и подтвердите установку.</li>
                        </ol>
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

export default InstallInstructionsModal;
