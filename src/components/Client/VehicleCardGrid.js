"use client"

import { useState } from 'react';

const VehicleCardGrid = ({ vehicles, vehicleImages, loading, startDate, endDate }) => {
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const navigateImage = (vehicleId, direction) => {
    const images = vehicleImages[vehicleId] || [];
    const currentIndex = activeImageIndex[vehicleId] || 0;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setActiveImageIndex(prev => ({
      ...prev,
      [vehicleId]: newIndex
    }));
  };

  // Implementar aqui o aluguel
  const handleRentClick = (vehicle) => {
    alert(`Iniciando processo de aluguel para ${vehicle.model} ${vehicle.brand}`);
  };

  const getFuelTypeText = (fuelType) => {
    const fuelTypes = {
      'GASOLINE': 'Gasolina',
      'ETHANOL': 'Etanol',
      'ELECTRIC': 'Elétrico'
    };
    return fuelTypes[fuelType] || fuelType;
  };

  const getCategoryText = (category) => {
    const categories = {
      'MOTORCYCLE': 'Moto',
      'VAN': 'Van',
      'TRUCK': 'Caminhão',
      'ECONOMY': 'Econômico',
      'LUXURY': 'Luxo',
      'SUV': 'SUV'
    };
    return categories[category] || category;
  };

  if (loading) {
    return <div className="loading-container">Carregando veículos...</div>;
  }

  if (vehicles.length === 0) {
    return <div className="no-vehicles">Nenhum veículo disponível para os filtros selecionados.</div>;
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map(vehicle => {
        const images = vehicleImages[vehicle.vehicleId] || [];
        const currentImageIndex = activeImageIndex[vehicle.vehicleId] || 0;
        
        return (
          <div key={vehicle.vehicleId} className="vehicle-card">
            <div className="vehicle-image-carousel">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[currentImageIndex].url || "/placeholder.svg"}
                    alt={images[currentImageIndex].description || `${vehicle.brand} ${vehicle.model}`} 
                    className="vehicle-image"
                  />
                  
                  {images.length > 1 && (
                    <div className="carousel-controls">
                      <button 
                        className="carousel-button prev"
                        onClick={() => navigateImage(vehicle.vehicleId, 'prev')}
                      >
                        &lt;
                      </button>
                      <div className="carousel-indicators">
                        {images.map((_, index) => (
                          <span 
                            key={index} 
                            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <button 
                        className="carousel-button next"
                        onClick={() => navigateImage(vehicle.vehicleId, 'next')}
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image">Sem imagem disponível</div>
              )}
            </div>
            
            <div className="vehicle-info">
              <h3 className="vehicle-title">{vehicle.brand} {vehicle.model}</h3>
              <div className="vehicle-details">
                <p><strong>Ano:</strong> {vehicle.year}</p>
                <p><strong>Categoria:</strong> {getCategoryText(vehicle.category)}</p>
                <p><strong>Combustível:</strong> {getFuelTypeText(vehicle.fuelType)}</p>
                <p><strong>Cor:</strong> {vehicle.color}</p>
                {vehicle.additionalFeatures && (
                  <p><strong>Características:</strong> {vehicle.additionalFeatures}</p>
                )}
              </div>
              <button 
                className="rent-button"
                onClick={() => handleRentClick(vehicle)}
              >
                ALUGAR
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleCardGrid;
