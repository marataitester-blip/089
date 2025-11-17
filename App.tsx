
import React, { useState, useEffect } from 'react';
import { cards } from './data/cards';
import type { TarotCard } from './types';
import Modal from './components/Modal';
import InstallInstructionsModal from './components/InstallInstructionsModal';

const App: React.FC = () => {
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
    const [cardOfTheDay, setCardOfTheDay] = useState<TarotCard | null>(null);
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);

    useEffect(() => {
        // --- PWA Setup ---
        const manifest = {
          short_name: "Таро Героя",
          name: "Энциклопедия Таро Астрального Героя",
          icons: [
            {
              src: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/19_sun.png",
              type: "image/png",
              sizes: "192x192",
              purpose: "any maskable"
            },
            {
              src: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/19_sun.png",
              type: "image/png",
              sizes: "512x512",
              purpose: "any maskable"
            }
          ],
          start_url: ".",
          display: "standalone",
          theme_color: "#0f0f14",
          background_color: "#0f0f14",
        };

        const stringifiedManifest = JSON.stringify(manifest);
        const blob = new Blob([stringifiedManifest], {type: 'application/json'});
        const manifestURL = URL.createObjectURL(blob);
        
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = manifestURL;
        document.head.appendChild(link);

        const swContent = `
            const CACHE_NAME = 'astral-hero-tarot-v1';
            self.addEventListener('install', event => {
                self.skipWaiting();
            });

            self.addEventListener('activate', event => {
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.filter(name => name !== CACHE_NAME)
                                      .map(name => caches.delete(name))
                        );
                    })
                );
            });

            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request).then(response => {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request).then(networkResponse => {
                            if (networkResponse && networkResponse.status === 200) {
                                const responseToCache = networkResponse.clone();
                                caches.open(CACHE_NAME).then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            }
                            return networkResponse;
                        });
                    })
                );
            });
        `;
        const swBlob = new Blob([swContent], {type: 'application/javascript'});
        const swURL = URL.createObjectURL(swBlob);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(swURL)
                .then(registration => console.log('SW registered.', registration))
                .catch(err => console.error('SW registration failed:', err));
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);


    const handleCardClick = (card: TarotCard) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };
    
    const handleCardOfTheDayClick = () => {
        const randomIndex = Math.floor(Math.random() * cards.length);
        setCardOfTheDay(cards[randomIndex]);
    };

    const handleInstallClick = async () => {
        if (!installPromptEvent) return;
        installPromptEvent.prompt();
        setShowInstallModal(false);
        const { outcome } = await installPromptEvent.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }
        setInstallPromptEvent(null);
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-fg font-garamond p-4 sm:p-6 md:p-8">
            <header className="text-center mb-8">
                <h1 className="font-cinzel text-brand-accent text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider">
                    Энциклопедия Таро Астрального Героя
                </h1>
                <div className="mt-4">
                    <a
                        href="https://t.me/maratbikchurin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-transparent border border-brand-accent text-brand-accent font-cinzel py-2 px-6 rounded-lg hover:bg-brand-accent hover:text-brand-bg transition-colors duration-300 text-base tracking-wider"
                    >
                        Связаться с Мастером (колоды, расклады)
                    </a>
                </div>
            </header>

            <main className="pb-24">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                    {cards.map((card, index) => (
                        <div key={card.name} onClick={() => handleCardClick(card)} className="cursor-pointer group">
                             <img
                                src={card.imageUrl}
                                alt={card.name}
                                loading={index < 4 ? 'eager' : 'lazy'}
                                decoding="async"
                                width="600"
                                height="1040"
                                className="w-full h-auto rounded-lg border border-brand-accent/25 aspect-[600/1040] object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-brand-accent/30"
                            />
                        </div>
                    ))}
                </div>
            </main>

            {selectedCard && <Modal card={selectedCard} onClose={handleCloseModal} />}
            {cardOfTheDay && <Modal card={cardOfTheDay} onClose={() => setCardOfTheDay(null)} title="Карта Дня" />}
            {showInstallModal && (
                <InstallInstructionsModal 
                    onClose={() => setShowInstallModal(false)}
                    onInstallClick={handleInstallClick}
                    installPromptAvailable={!!installPromptEvent}
                />
            )}

            {/* Install Button (Bottom Left) */}
            <button
                onClick={() => setShowInstallModal(true)}
                className="fixed bottom-4 left-4 z-50 bg-brand-accent text-brand-bg h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-accent/40 border-2 border-amber-200/50 hover:brightness-110 transition-all transform hover:scale-110"
                aria-label="Установить приложение"
                title="Установить приложение"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>

            {/* Card of the Day Button (Bottom Right) */}
            <button 
                onClick={handleCardOfTheDayClick}
                className="fixed bottom-4 right-4 z-50 bg-brand-accent text-brand-bg h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-brand-accent/40 border-2 border-amber-200/50 hover:brightness-110 transition-all transform hover:scale-110"
                aria-label="Карта Дня"
                title="Карта Дня"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
    );
};

export default App;
