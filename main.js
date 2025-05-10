// Banco de dados de imóveis com fotos reais
const properties = {
  apartamentos: [
    { 
      id: 1, 
      title: "Apartamento 2 Quartos Centro", 
      price: 350000, 
      type: "venda", 
      neighborhood: "Centro", 
      description: "Apartamento bem localizado com 2 quartos, sendo 1 suíte, sala ampla e cozinha planejada.",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      ] 
    },
    // ... (adicionar mais 9 apartamentos)
  ],
  casas: [
    { 
      id: 11, 
      title: "Casa 3 Quartos Gleba", 
      price: 950000, 
      type: "venda", 
      neighborhood: "Gleba Palhano", 
      description: "Casa moderna com 3 quartos, garagem para 2 carros, piscina e área gourmet.",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      ]
    },
    // ... (adicionar mais 9 casas)
  ],
  comerciais: [
    { 
      id: 21, 
      title: "Sala Comercial Centro", 
      price: 800000, 
      type: "venda", 
      neighborhood: "Centro", 
      description: "Sala comercial de 100m² em localização privilegiada, perfeita para escritórios.",
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      ]
    },
    // ... (adicionar mais 9 comerciais)
  ],
  terrenos: [
    { 
      id: 31, 
      title: "Terreno Higienópolis", 
      price: 250000, 
      type: "venda", 
      neighborhood: "Jardim Higienópolis", 
      description: "Terreno plano de 300m² em ótima localização, pronto para construir.",
      images: [
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
      ]
    }
    // ... (adicionar mais 9 terrenos)
  ]
};

// Funções auxiliares
function formatPrice(price, type) {
  return type === 'aluguel' 
    ? `R$ ${price.toLocaleString('pt-BR')}/mês` 
    : `R$ ${price.toLocaleString('pt-BR')}`;
}

function renderProperties(props, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = props.map(prop => `
    <div class="property-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300">
      <a href="property.html?id=${prop.id}">
        <img src="${prop.images[0]}" alt="${prop.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">${prop.title}</h3>
          <p class="text-primary font-bold mb-2">${formatPrice(prop.price, prop.type)}</p>
          <p class="text-gray-600 mb-2">${prop.neighborhood}</p>
          <p class="text-gray-500">${prop.description.substring(0, 80)}...</p>
        </div>
      </a>
    </div>
  `).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Página inicial
  if (document.getElementById('listings-container') && window.location.pathname.includes('index.html')) {
    const featured = [
      ...properties.apartamentos.slice(0, 3),
      ...properties.casas.slice(0, 3),
      ...properties.comerciais.slice(0, 2),
      ...properties.terrenos.slice(0, 2)
    ];
    renderProperties(featured, 'listings-container');
  }

  // Configura formulário de busca
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(searchForm);
      const params = new URLSearchParams();
      
      if (formData.get('tipo')) params.append('type', formData.get('tipo'));
      if (formData.get('categoria')) params.append('category', formData.get('categoria'));
      if (formData.get('bairro')) params.append('bairro', formData.get('bairro'));
      
      window.location.href = `listing.html?${params.toString()}`;
    });
  }
});
