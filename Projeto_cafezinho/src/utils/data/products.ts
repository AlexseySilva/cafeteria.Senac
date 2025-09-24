const MENU = [
  {
    title: "Drinks",
    data: [
      {
        id: "1",
        title: "Expresso Cappuccino",
        description: [
          "cappuccino"
        ],
        cover: require("../../assets/products/cover/Coffe_1.png"),
        thumbnail: require("../../assets/products/thumbnail/Coffe1.png"),
        ingredients: [
          "Espresso","Milk","White Chocolate Syrup","Caramel Drizzle",
        ],
      },
    ],
  },


  //{
    
    data: [
      {
        id: "2",
        title: "Expresso Latte",
        cover: require("../../assets/products/cover/Coffe_2.png"),
        thumbnail: require("../../assets/products/thumbnail/Coffe2.png"),
        ingredients: [
          "Leite vaporizado",
          "Combinado com uma fina camada final de espuma de leite por cima",
        ],
      },

      {
        id: "3",
        title: "Expresso Americano",
        cover: require("../../assets/products/cover/Coffe_3.png"),
        thumbnail: require("../../assets/products/thumbnail/Coffe3.png"),
        ingredients: [
          "Agua","Cafe expresso",
        ],
      },

      {
        id: "4",
        title: "Expresso Mocha",
        cover: require("../../assets/products/cover/Coffe_4.png"),
        thumbnail: require("../../assets/products/thumbnail/Coffe4.png"),
        ingredients: [
          "Agua","Leite vaporizado","Caramelo"],
      },
    ],
 // },

  // {
  //   //title: "Savory",
  //   //title: "Sweets",
  //   data: [
    
  //   ],
  // },
];

const PRODUCTS = MENU.map((item) => item.data).flat();

const CATEGORIES = MENU.map((item) => item.title);

type ProductProps = (typeof PRODUCTS)[0];

export { MENU, PRODUCTS, CATEGORIES, ProductProps };
