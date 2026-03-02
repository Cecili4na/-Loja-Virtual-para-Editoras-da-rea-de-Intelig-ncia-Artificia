import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const col = db.collection("produtos");
  const count = await col.countDocuments();

  if (count > 0) {
    return NextResponse.json({ message: "Seed skipped (already has data)", count });
  }

   const sample = [
  {
    titulo: "Introdução ao Machine Learning",
    autor: "Dr. João Silva",
    preco: 89.9,
    tipo: "fisico",
    imagem: "https://dataat.github.io/introducao-ao-machine-learning/assets/capa.png",
    createdAt: new Date(),
  },
  {
    titulo: "Deep Learning com Python",
    autor: "François Chollet",
    preco: 149.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Hands-On Machine Learning",
    autor: "Aurélien Géron",
    preco: 199.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81E1gD2O0GL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Python for Data Analysis",
    autor: "Wes McKinney",
    preco: 139.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71Q2ojXH8nL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Artificial Intelligence: A Modern Approach",
    autor: "Russell & Norvig",
    preco: 249.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Pattern Recognition and Machine Learning",
    autor: "Christopher Bishop",
    preco: 229.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81Nf4cM88oL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Data Science do Zero",
    autor: "Joel Grus",
    preco: 119.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81OthjkJBuL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Grokking Machine Learning",
    autor: "Luis Serrano",
    preco: 159.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71q+6hX8mEL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Deep Reinforcement Learning",
    autor: "Maxim Lapan",
    preco: 169.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71k9CBh6p+L.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Generative Deep Learning",
    autor: "David Foster",
    preco: 179.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81hbtMUnYwL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Transformers for NLP",
    autor: "Denis Rothman",
    preco: 159.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71Y5gZsE1bL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "ChatGPT for Developers",
    autor: "OpenAI Press",
    preco: 79.9,
    tipo: "digital",
    imagem: "https://m.media-amazon.com/images/I/61H6uK4n+8L.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Large Language Models in Practice",
    autor: "AI Research Group",
    preco: 99.9,
    tipo: "digital",
    imagem: "https://m.media-amazon.com/images/I/71Z3YpOa4TL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Practical Statistics for Data Scientists",
    autor: "Peter Bruce",
    preco: 129.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81f0n8P0RFL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Building AI Powered Apps",
    autor: "Full Stack AI",
    preco: 89.9,
    tipo: "digital",
    imagem: "https://m.media-amazon.com/images/I/71+7x6q8XVL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Applied Deep Learning",
    autor: "Umberto Michelucci",
    preco: 149.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71q5N5L7AQL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Computer Vision Basics",
    autor: "OpenCV Team",
    preco: 109.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/81SxLkzX3PL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Neural Networks from Scratch",
    autor: "Harrison Kinsley",
    preco: 139.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71gC9h0CqLL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "Prompt Engineering Mastery",
    autor: "AI Labs",
    preco: 59.9,
    tipo: "digital",
    imagem: "https://m.media-amazon.com/images/I/71H8uC2k+UL.jpg",
    createdAt: new Date(),
  },
  {
    titulo: "AI for Business Leaders",
    autor: "Tech Strategy Press",
    preco: 119.9,
    tipo: "fisico",
    imagem: "https://m.media-amazon.com/images/I/71fZ9cE9vTL.jpg",
    createdAt: new Date(),
  },
];

  const res = await col.insertMany(sample);
  return NextResponse.json({ message: "Seed inserted", inserted: res.insertedCount });
}