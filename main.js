// Função para formatar preço
function formatPrice(price, type) {
  if (type === 'aluguel') {
    return `R$ ${price.toLocaleString('pt-BR')}/mês`;
  }
  return `R$ ${price.toLocaleString('pt-BR')}`;
}

// Função para renderizar cards de imóveis
function renderProperties(properties, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = properties.map(property => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <a href="property.html?id=${property.id}">
        <img src="${property.images[0]}" alt="${property.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">${property.title}</h3>
          <p class="text-primary font-bold mb-2">${formatPrice(property.price, property.type)}</p>
          <p class="text-gray-600 mb-2">${property.neighborhood}</p>
          <p class="text-gray-500 text-sm">${property.description.substring(0, 100)}...</p>
        </div>
      </a>
    </div>
  `).join('');
}

// Função para filtrar imóveis
function filterProperties(filters) {
  let results = [];
  
  // Se categoria específica foi selecionada, filtra por ela
  if (filters.category && properties[filters.category]) {
    results = properties[filters.category];
  } else {
    // Caso contrário, pega todos os imóveis de todas as categorias
    results = Object.values(properties).flat();
  }

  // Aplica outros filtros
  if (filters.type) {
    results = results.filter(prop => prop.type === filters.type);
  }
  
  if (filters.neighborhood) {
    results = results.filter(prop => 
      prop.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
    );
  }
  
  if (filters.value) {
    const [min, max] = filters.value.split('-');
    if (max) {
      results = results.filter(prop => 
        prop.price >= parseInt(min) && prop.price <= parseInt(max)
      );
    } else {
      results = results.filter(prop => prop.price >= parseInt(min));
    }
  }

  return results;
}

// Função para carregar parâmetros da URL
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category'),
    type: params.get('type'),
    neighborhood: params.get('bairro'),
    value: params.get('valor')
  };
}

// Função para mostrar detalhes do imóvel
function showPropertyDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  if (!id) return;
  
  // Encontra o imóvel em todas as categorias
  let property = null;
  for (const category in properties) {
    const found = properties[category].find(p => p.id === id);
    if (found) {
      property = found;
      break;
    }
  }
  
  if (!property) return;
  
  // Atualiza a página com os dados do imóvel
  document.getElementById('property-title').textContent = property.title;
  document.getElementById('property-price').textContent = formatPrice(property.price, property.type);
  document.getElementById('property-neighborhood').textContent = property.neighborhood;
  document.getElementById('property-description').textContent = property.description;
  
  const mainImg = document.getElementById('gallery-main');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  
  if (property.images.length > 0) {
    mainImg.src = property.images[0];
    mainImg.alt = property.title;
    
    thumbs.forEach((thumb, index) => {
      if (property.images[index + 1]) {
        thumb.src = property.images[index + 1];
        thumb.alt = property.title;
        thumb.onclick = () => mainImg.src = property.images[index + 1];
      } else {
        thumb.style.display = 'none';
      }
    });
  }
}

// Função para lidar com o formulário de busca
function setupSearchForm() {
  const form = document.getElementById('search-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    if (formData.get('tipo')) params.append('type', formData.get('tipo'));
    if (formData.get('categoria')) params.append('category', formData.get('categoria'));
    if (formData.get('bairro')) params.append('bairro', formData.get('bairro'));
    if (formData.get('valor')) params.append('valor', formData.get('valor'));
    
    window.location.href = `listing.html?${params.toString()}`;
  });
}

// Função para lidar com o formulário de upload
function setupUploadForm() {
  const form = document.getElementById('upload-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const newProperty = {
      id: Math.max(...Object.values(properties).flat().map(p => p.id)) + 1,
      title: formData.get('title'),
      type: formData.get('type'),
      price: parseInt(formData.get('price')),
      neighborhood: formData.get('neighborhood'),
      description: formData.get('description'),
      images: [
        URL.createObjectURL(formData.get('image1')),
        URL.createObjectURL(formData.get('image2'))
      ]
    };
    
    const category = formData.get('category');
    if (properties[category]) {
      properties[category].push(newProperty);
      alert('Imóvel cadastrado com sucesso!');
      form.reset();
    } else {
      alert('Categoria inválida');
    }
  });
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
  // Página inicial - mostra destaques
  if (document.getElementById('listings-container') && window.location.pathname.includes('index.html')) {
    const featured = [
      ...properties.apartamentos.slice(0, 3),
      ...properties.casas.slice(0, 3),
      ...properties.comerciais.slice(0, 2),
      ...properties.terrenos.slice(0, 1),
      ...properties.chacaras.slice(0, 1)
    ];
    renderProperties(featured, 'listings-container');
  }
  
  // Página de listagem
  if (document.getElementById('listings-container') && window.location.pathname.includes('listing.html')) {
    const filters = getUrlParams();
    const filteredProperties = filterProperties(filters);
    
    // Atualiza título da categoria se estiver filtrando por categoria
    if (filters.category) {
      const categoryTitle = document.getElementById('category-title');
      if (categoryTitle) {
        const categoryNames = {
          apartamentos: 'Apartamentos',
          casas: 'Casas',
          comerciais: 'Imóveis Comerciais',
          terrenos: 'Terrenos',
          chacaras: 'Chácaras'
        };
        categoryTitle.textContent = categoryNames[filters.category] || 'Imóveis';
      }
    }
    
    renderProperties(filteredProperties, 'listings-container');
  }
  
  // Página de detalhes do imóvel
  if (window.location.pathname.includes('property.html')) {
    showPropertyDetails();
  }
  
  // Configura formulários
  setupSearchForm();
  setupUploadForm();
});
