
import React, { useState } from 'react';
import { cards } from './data/cards';
import type { TarotCard } from './types';
import Modal from './components/Modal';

const App: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

    const handleCardClick = (card: TarotCard) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-fg font-garamond p-4 sm:p-6 md:p-8">
            <header className="text-center mb-8">
                <h1 className="font-cinzel text-brand-accent text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider">
                    Энциклопедия Таро Астрального Героя
                </h1>
            </header>

            <main>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                    {cards.map((card) => (
                        <div key={card.name} onClick={() => handleCardClick(card)} className="cursor-pointer group">
                             <img
                                src={card.imageUrl}
                                alt={card.name}
                                loading="lazy"
                                className="w-full h-auto rounded-lg border border-brand-accent/25 aspect-[600/1040] object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-accent/30"
                            />
                        </div>
                    ))}
                </div>
            </main>

            {selectedCard && <Modal card={selectedCard} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;
