// Base de datos de productos
const productsDatabase = [
    // SORPRESAS ROMÁNTICAS (10 productos)
    { id: 1, name: "Caja de Amor Clásica", price: 45000, category: "sorpresas", image: "../img/ImgProvicional.jpg", description: "Flores, chocolates y detalles únicos" },
    { id: 2, name: "Caja Premium Deluxe", price: 75000, category: "sorpresas", image: "../img/ImgProvicional2.jpg", description: "Rosas premium, vino y chocolates gourmet" },
    { id: 3, name: "Combo Romántico Especial", price: 95000, category: "sorpresas", image: "../img/ImgProvicional3.jpg", description: "Flores, globos, chocolates y peluche" },
    { id: 4, name: "Desayuno Sorpresa", price: 65000, category: "sorpresas", image: "../img/ImgProvicional.jpg", description: "Desayuno completo entregado en cama" },
    { id: 5, name: "Caja Día del Amor", price: 85000, category: "sorpresas", image: "../img/ImgProvicional2.jpg", description: "Edición especial San Valentín" },
    { id: 6, name: "Serenata Sorpresa", price: 120000, category: "sorpresas", image: "../img/ImgProvicional3.jpg", description: "Música en vivo con flores y detalles" },
    { id: 7, name: "Picnic Romántico", price: 105000, category: "sorpresas", image: "../img/ImgProvicional.jpg", description: "Set completo para picnic perfecto" },
    { id: 8, name: "Caja Aniversario", price: 90000, category: "sorpresas", image: "../img/ImgProvicional2.jpg", description: "Celebra su día especial" },
    { id: 9, name: "Regalo Personalizado", price: 55000, category: "sorpresas", image: "../img/ImgProvicional3.jpg", description: "Totalmente personalizable" },
    { id: 10, name: "Caja Te Amo", price: 70000, category: "sorpresas", image: "../img/ImgProvicional.jpg", description: "Expresa tus sentimientos" },

    // CHARCUTERÍA Y TABLAS (15 productos)
    { id: 11, name: "Tabla Gourmet Clásica", price: 65000, category: "charcuteria", image: "../img/ImgProvicional2.jpg", description: "Selección de quesos y embutidos" },
    { id: 12, name: "Tabla Premium de Quesos", price: 85000, category: "charcuteria", image: "../img/ImgProvicional3.jpg", description: "5 quesos importados selectos" },
    { id: 13, name: "Tabla Mediterránea", price: 75000, category: "charcuteria", image: "../img/ImgProvicional.jpg", description: "Sabores del mediterráneo" },
    { id: 14, name: "Tabla Española", price: 95000, category: "charcuteria", image: "../img/ImgProvicional2.jpg", description: "Jamón ibérico y queso manchego" },
    { id: 15, name: "Tabla Italiana Deluxe", price: 110000, category: "charcuteria", image: "../img/ImgProvicional3.jpg", description: "Prosciutto, salami y parmesano" },
    { id: 16, name: "Tabla de Carnes Frías", price: 70000, category: "charcuteria", image: "../img/ImgProvicional.jpg", description: "Variedad de embutidos premium" },
    { id: 17, name: "Tabla Vegana", price: 60000, category: "charcuteria", image: "../img/ImgProvicional2.jpg", description: "Quesos y embutidos vegetales" },
    { id: 18, name: "Tabla Mini Personal", price: 35000, category: "charcuteria", image: "../img/ImgProvicional3.jpg", description: "Perfecta para una persona" },
    { id: 19, name: "Tabla Familiar Grande", price: 150000, category: "charcuteria", image: "../img/ImgProvicional.jpg", description: "Para 8-10 personas" },
    { id: 20, name: "Tabla de Frutos Secos", price: 55000, category: "charcuteria", image: "../img/ImgProvicional2.jpg", description: "Nueces, almendras y más" },
    { id: 21, name: "Tabla Mix Dulce-Salado", price: 80000, category: "charcuteria", image: "../img/ImgProvicional3.jpg", description: "Combinación perfecta" },
    { id: 22, name: "Tabla de Quesos Nacionales", price: 65000, category: "charcuteria", image: "../img/ImgProvicional.jpg", description: "Lo mejor de Colombia" },
    { id: 23, name: "Tabla Ejecutiva", price: 75000, category: "charcuteria", image: "../img/ImgProvicional2.jpg", description: "Ideal para reuniones" },
    { id: 24, name: "Tabla con Vino", price: 125000, category: "charcuteria", image: "../img/ImgProvicional3.jpg", description: "Incluye vino premium" },
    { id: 25, name: "Tabla Gourmet Suprema", price: 135000, category: "charcuteria", image: "../img/ImgProvicional.jpg", description: "La mejor selección" },

    // EVENTOS Y CELEBRACIONES (10 productos)
    { id: 26, name: "Paquete Cumpleaños", price: 120000, category: "eventos", image: "../img/ImgProvicional2.jpg", description: "Todo para cumpleaños especial" },
    { id: 27, name: "Kit Baby Shower", price: 95000, category: "eventos", image: "../img/ImgProvicional3.jpg", description: "Decoración y detalles" },
    { id: 28, name: "Pack Despedida Soltera", price: 110000, category: "eventos", image: "../img/ImgProvicional.jpg", description: "Diversión garantizada" },
    { id: 29, name: "Kit Boda Civil", price: 85000, category: "eventos", image: "../img/ImgProvicional2.jpg", description: "Detalles para tu gran día" },
    { id: 30, name: "Paquete Aniversario Premium", price: 145000, category: "eventos", image: "../img/ImgProvicional3.jpg", description: "Celebración inolvidable" },
    { id: 31, name: "Kit Graduación", price: 75000, category: "eventos", image: "../img/ImgProvicional.jpg", description: "Festeja tu logro" },
    { id: 32, name: "Pack Día de la Madre", price: 90000, category: "eventos", image: "../img/ImgProvicional2.jpg", description: "Para mamá especial" },
    { id: 33, name: "Kit Día del Padre", price: 85000, category: "eventos", image: "../img/ImgProvicional3.jpg", description: "Regalo perfecto para papá" },
    { id: 34, name: "Paquete Pedida de Mano", price: 180000, category: "eventos", image: "../img/ImgProvicional.jpg", description: "Momento mágico" },
    { id: 35, name: "Kit Bienvenida Bebé", price: 70000, category: "eventos", image: "../img/ImgProvicional2.jpg", description: "Celebra la nueva vida" },

    // CHOCOLATES Y DULCES (8 productos)
    { id: 36, name: "Caja Chocolates Artesanales", price: 35000, category: "dulces", image: "../img/ImgProvicional3.jpg", description: "15 unidades hechas a mano" },
    { id: 37, name: "Fresas Cubiertas Premium", price: 45000, category: "dulces", image: "../img/ImgProvicional.jpg", description: "Fresas frescas bañadas" },
    { id: 38, name: "Bombones Gourmet", price: 50000, category: "dulces", image: "../img/ImgProvicional2.jpg", description: "Variedad exquisita" },
    { id: 39, name: "Brownie Deluxe Box", price: 40000, category: "dulces", image: "../img/ImgProvicional3.jpg", description: "6 brownies gigantes" },
    { id: 40, name: "Cupcakes Personalizados", price: 55000, category: "dulces", image: "../img/ImgProvicional.jpg", description: "Docena decorada" },
    { id: 41, name: "Torta Personalizada", price: 120000, category: "dulces", image: "../img/ImgProvicional2.jpg", description: "Diseño a tu gusto" },
    { id: 42, name: "Macarons Franceses", price: 65000, category: "dulces", image: "../img/ImgProvicional3.jpg", description: "Caja de 12 sabores" },
    { id: 43, name: "Cesta de Postres", price: 85000, category: "dulces", image: "../img/ImgProvicional.jpg", description: "Variedad de delicias" },

    // ARREGLOS FLORALES (7 productos)
    { id: 44, name: "Ramo de Rosas Rojas", price: 55000, category: "flores", image: "../img/ImgProvicional2.jpg", description: "12 rosas premium" },
    { id: 45, name: "Arreglo Girasoles", price: 45000, category: "flores", image: "../img/ImgProvicional3.jpg", description: "Alegría en flores" },
    { id: 46, name: "Bouquet Mixto Deluxe", price: 75000, category: "flores", image: "../img/ImgProvicional.jpg", description: "Flores de temporada" },
    { id: 47, name: "Caja de Rosas Eternas", price: 95000, category: "flores", image: "../img/ImgProvicional2.jpg", description: "Duran hasta 3 años" },
    { id: 48, name: "Arreglo Orquídeas", price: 85000, category: "flores", image: "../img/ImgProvicional3.jpg", description: "Elegancia pura" },
    { id: 49, name: "Ramo 100 Rosas", price: 250000, category: "flores", image: "../img/ImgProvicional.jpg", description: "Impacto garantizado" },
    { id: 50, name: "Centro de Mesa Floral", price: 65000, category: "flores", image: "../img/ImgProvicional2.jpg", description: "Perfecto para eventos" }
];