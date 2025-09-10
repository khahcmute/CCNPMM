// src/components/product/CategoryMenu.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // 🔥 gọi API categories từ backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <nav className="bg-white shadow-md px-4 py-2">
      <ul className="flex space-x-6">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/category/${cat.slug}`}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryMenu;
