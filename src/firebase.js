// Importa as funções do Firebase direto da internet (não precisa instalar nada)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Cole aqui o firebaseConfig que o Firebase te deu no passo 7 acima
const firebaseConfig = {
  apiKey: "AIzaSyCf8Nat-8c1udj75Adzhtvr72op9JSI-NM",
  authDomain: "denuncias-e-ocorrencias.firebaseapp.com",
  projectId: "denuncias-e-ocorrencias",
  storageBucket: "denuncias-e-ocorrencias.firebasestorage.app",
  messagingSenderId: "684176323127",
  appId: "1:684176323127:web:c6d110222f2b81068085b2"
};

// Inicializa o Firebase com essa configuração
const app = initializeApp(firebaseConfig);

// Cria a conexão com o Firestore e exporta para usar em outros arquivos
export const db = getFirestore(app);