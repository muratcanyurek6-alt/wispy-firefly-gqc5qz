import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  limit,
  startAfter,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  MapPin,
  Users,
  PlusSquare,
  Search,
  CheckCircle,
  Star,
  Zap,
  X,
  Edit2,
  Trash2,
  Loader2,
  MessageCircle,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Crown,
  Send,
  Flame,
  Database,
  LogOut,
  Sun,
  Moon,
  Home,
  Wand2,
  User,
  TrendingUp,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";

// --- TASARIM KURTARICI ---
const TailwindCDN = () => (
  <>
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      .safe-area-top { padding-top: env(safe-area-inset-top); }
      .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .h-mobile-chat { height: calc(100vh - 60px); }
    `}</style>
  </>
);

/* --- CLOUDINARY AYARLARI --- */
const CLOUDINARY_CONFIG = {
  cloudName: "dqoh1mjjk",
  uploadPreset: "yxdnini8",
};

/* --- FIREBASE AYARLARI --- */
const firebaseConfig = {
  apiKey: "AIzaSyAQmTeBxY21B0y51uJVfGCirJIi4xuSeWE",
  authDomain: "linkup-app-6318c.firebaseapp.com",
  projectId: "linkup-app-6318c",
  storageBucket: "linkup-app-6318c.firebasestorage.app",
  messagingSenderId: "189601473644",
  appId: "1:189601473644:web:b9e7f2339faf83e7ede449",
  measurementId: "G-QNG54EJ9R5",
};

const apiKey = ""; // Gemini API Key

/* --- SİSTEM BAŞLATILIYOR --- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* --- KATEGORİLER --- */
const CATEGORIES = [
  { id: "COLLAB", label: "Collab 🎥", color: "purple" },
  { id: "S4S", label: "S4S / Promo 🔄", color: "pink" },
  { id: "AGENCY", label: "Agency 🏢", color: "indigo" },
  { id: "TRAVEL", label: "Travel ✈️", color: "blue" },
  { id: "HOUSING", label: "Housing 🏠", color: "emerald" },
  { id: "SERVICE", label: "Services 📸", color: "orange" },
];

/* --- RESİM YÜKLEME FONKSİYONU --- */
const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    alert("Resim yüklenemedi.");
    return null;
  }
};

/* --- SAHTE VERİ OLUŞTURUCU --- */
const generateFakeData = async () => {
  alert("⚠️ Fake Data özelliği kodda mevcut ama buton gizli.");
};

// --- NAV ITEM COMPONENT ---
const NavItem = ({
  tab,
  icon: Icon,
  label,
  activeTab,
  setActiveTab,
  requireAuth,
  setEditingPost,
  setShowPostModal,
  mobileOnly,
}) => (
  <button
    onClick={() => {
      if (tab === "post") {
        requireAuth(() => {
          setEditingPost(null);
          setShowPostModal(true);
        });
      } else if (tab === "profile" || tab === "chat") {
        requireAuth(() => {
          setActiveTab(tab);
          window.scrollTo(0, 0);
        });
      } else {
        setActiveTab(tab);
        window.scrollTo(0, 0);
      }
    }}
    className={`flex flex-col items-center justify-center px-3 py-1 transition-colors 
      ${mobileOnly ? "md:hidden w-full" : ""} 
      ${
        activeTab === tab
          ? "text-pink-500"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
  >
    <Icon
      className={`h-6 w-6 ${activeTab === tab ? "fill-current" : ""}`}
      strokeWidth={activeTab === tab ? 2.5 : 2}
    />
    <span
      className={`text-[10px] mt-0.5 font-medium ${
        mobileOnly ? "" : "md:hidden"
      }`}
    >
      {label}
    </span>
  </button>
);

// --- SPOTLIGHT BİLEŞENİ ---
const Spotlight = ({ posts, onProfileClick }) => {
  const scrollRef = React.useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const loopPosts = posts.length > 0 ? [...posts, ...posts, ...posts] : [];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const scrollStep = 1;

    const scrollInterval = setInterval(() => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollLeft += scrollStep;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, 20);
    return () => clearInterval(scrollInterval);
  }, [isPaused, posts]);

  if (posts.length === 0) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 mb-3 px-4">
        <TrendingUp className="h-5 w-5 text-yellow-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider">
          Spotlight Creators
        </h3>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 no-scrollbar"
        style={{ whiteSpace: "nowrap", overflowX: "hidden" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {loopPosts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            onClick={() => onProfileClick(post)}
            className="min-w-[260px] inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl cursor-pointer hover:border-yellow-500/50 transition-all shadow-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" /> FEATURED
            </div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <img
                src={post.image}
                className="h-12 w-12 rounded-full object-cover border-2 border-yellow-500 shadow-md"
              />
              <div className="truncate">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-32">
                  {post.name}
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-yellow-500" /> {post.location}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-normal relative z-10">
              {post.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CHAT LİSTESİ BİLEŞENİ ---
const ChatList = ({ user, activeChat, setActiveChat }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.id),
      orderBy("lastUpdated", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const otherUserId = data.participants.find((id) => id !== user.id);
        const otherUser = data.users?.[otherUserId] || {
          name: "Unknown",
          image: "https://via.placeholder.com/150",
        };

        return {
          id: doc.id,
          ownerId: otherUserId,
          name: otherUser.name,
          image: otherUser.image || "https://via.placeholder.com/150",
          lastMessage: data.lastMessage,
          time: data.lastUpdated,
        };
      });
      setChats(chatList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading)
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-pink-500" />
      </div>
    );

  if (chats.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setActiveChat(chat)}
          className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 ${
            activeChat?.id === chat.id
              ? "bg-pink-50 dark:bg-pink-900/10 border-l-4 border-l-pink-500"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <img
            src={chat.image}
            className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3
                className={`font-bold truncate ${
                  activeChat?.id === chat.id
                    ? "text-pink-600 dark:text-pink-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {chat.name}
              </h3>
              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                {chat.time?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- CHAT PENCERESİ BİLEŞENİ ---
const ChatWindow = ({ activeChat, setActiveChat, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chatId = [user.id, activeChat.ownerId].sort().join("_");

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: messageText,
      senderId: user.id,
      createdAt: serverTimestamp(),
    });

    const chatRef = doc(db, "chats", chatId);
    await setDoc(
      chatRef,
      {
        participants: [user.id, activeChat.ownerId],
        users: {
          [user.id]: { name: user.name, image: user.image },
          [activeChat.ownerId]: {
            name: activeChat.name,
            image: activeChat.image,
          },
        },
        lastMessage: messageText,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 w-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10 shadow-sm sticky top-0 safe-area-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveChat(null)}
            className="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white p-1"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <img
            src={activeChat.image}
            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
              {activeChat.name}
            </h3>
            <span className="text-xs text-green-500 flex items-center gap-1">
              ● Online
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 bg-gray-50 dark:bg-black/50 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
              msg.senderId === user.id
                ? "self-end bg-pink-600 text-white rounded-br-none"
                : "self-start bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Alanı */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2 safe-area-bottom sticky bottom-0"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-5 py-3 text-gray-900 dark:text-white outline-none border border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-black transition-all"
          placeholder="Type a message..."
          autoFocus
        />
        <button
          type="submit"
          className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20 active:scale-95 transform"
        >
          <Send className="h-5 w-5 ml-0.5" />
        </button>
      </form>
    </div>
  );
};

// --- CHAT LAYOUT ---
const ChatLayout = ({ user, activeChat, setActiveChat }) => {
  return (
    <div className="flex h-mobile-chat md:h-[calc(100vh-80px)] max-w-6xl mx-auto w-full bg-white dark:bg-gray-900 md:border border-gray-200 dark:border-gray-800 md:rounded-2xl md:shadow-2xl overflow-hidden md:mt-4">
      <div
        className={`w-full md:w-[350px] border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 ${
          activeChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 safe-area-top">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
        </div>
        <ChatList
          user={user}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>

      <div
        className={`flex-1 bg-gray-50 dark:bg-black/20 ${
          !activeChat
            ? "hidden md:flex items-center justify-center"
            : "flex flex-col fixed inset-0 z-[100] md:static"
        }`}
      >
        {activeChat ? (
          <ChatWindow
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            user={user}
          />
        ) : (
          <div className="text-center text-gray-400 hidden md:block">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- PROFILE VIEW ---
const ProfileView = ({ user, setShowOnboarding, handleLogout, posts }) => {
  const myPosts = posts.filter((p) => p.ownerId === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg text-center mb-8">
        <div className="relative inline-block">
          <img
            src={user.image}
            className="h-32 w-32 rounded-full object-cover border-4 border-pink-500 mx-auto mb-4"
          />
          <button
            onClick={() => setShowOnboarding(true)}
            className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full border border-gray-700 hover:bg-gray-700"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {user.email}
        </p>
        <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
          {user.bio || "No bio yet."}
        </p>
        <div className="flex justify-center gap-4 mb-6">
          {user.socials?.instagram && (
            <a
              href={`https://instagram.com/${user.socials.instagram}`}
              target="_blank"
              className="text-pink-500 hover:text-pink-600"
            >
              <Instagram />
            </a>
          )}
          {user.socials?.twitter && (
            <a
              href={`https://twitter.com/${user.socials.twitter}`}
              target="_blank"
              className="text-blue-400 hover:text-blue-500"
            >
              <Twitter />
            </a>
          )}
          {user.socials?.onlyfans && (
            <a
              href={user.socials.onlyfans}
              target="_blank"
              className="text-blue-500 hover:text-blue-600"
            >
              <LinkIcon />
            </a>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full md:w-auto px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        My Posts ({myPosts.length})
      </h3>
      {myPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-xl"
            >
              <p className="text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                {post.desc}
              </p>
              <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>{post.type}</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AIStudio = () => (
  <div className="p-4 text-center text-gray-500 flex items-center justify-center h-[50vh]">
    AI Studio Coming Soon...
  </div>
);

// --- MODAL BİLEŞENLERİ ---

// AUTH MODAL
function AuthModal({ mode, setMode, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          {mode === "login" ? "Welcome Back" : "Join LinkUp"}
        </h2>
        <form
          onSubmit={(e) => onSubmit(e, email, password)}
          className="space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20 transition-colors"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-pink-600 font-bold hover:underline"
          >
            {mode === "login" ? "Create Account" : "Login instead"}
          </button>
        </div>
      </div>
    </div>
  );
}

// DÜZELTİLMİŞ ONBOARDING MODAL
function OnboardingModal({ onComplete, initialData }) {
  // State'i düzleştirilmiş (flat) olarak başlatıyoruz
  const [data, setData] = useState({
    name: initialData?.name || "",
    image:
      initialData?.image ||
      `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.floor(
        Math.random() * 1000
      )}`,
    bio: initialData?.bio || "",
    // İç içe veriyi (socials) düz hale getiriyoruz
    instagram: initialData?.socials?.instagram || "",
    twitter: initialData?.socials?.twitter || "",
    onlyfans: initialData?.socials?.onlyfans || "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      uploadImageToCloudinary(file).then((url) => {
        if (url) setData({ ...data, image: url });
        setUploading(false);
      });
    }
  };

  // Kaydet butonuna basıldığında çalışacak fonksiyon
  const handleSave = async () => {
    setSaving(true);
    try {
      await onComplete(data);
    } catch (error) {
      console.error("Profile save error:", error);
      alert("Error saving profile.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl max-h-[90vh] overflow-y-auto relative">
        {initialData && (
          <button
            onClick={() => onComplete(null)} // Null göndererek modalı kapat
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {initialData ? "Edit Profile" : "Setup Profile"}
        </h2>

        {/* FOTOĞRAF YÜKLEME */}
        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
          <img
            src={data.image}
            className="w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-800 object-cover"
            alt="Profile"
          />
          <label
            htmlFor="file-upload"
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer"
          >
            {uploading ? "Loading..." : "Upload"}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Display Name
            </label>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none mt-1 focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="e.g. Jessica Rabbit"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              About You (Bio)
            </label>
            <textarea
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none mt-1 focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Tell us about yourself..."
              rows="3"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-gray-400">
              {data.bio?.length || 0}/500
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Instagram
              </label>
              <input
                value={data.instagram}
                onChange={(e) =>
                  setData({ ...data, instagram: e.target.value })
                }
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1 focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="username"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Twitter / X
              </label>
              <input
                value={data.twitter}
                onChange={(e) => setData({ ...data, twitter: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1 focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              OnlyFans / Linktree
            </label>
            <input
              value={data.onlyfans}
              onChange={(e) => setData({ ...data, onlyfans: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1 focus:border-pink-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg mt-6 transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : initialData
            ? "Update Profile"
            : "Complete Profile"}
        </button>
      </div>
    </div>
  );
}

function PostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: "COLLAB",
    location: "",
    desc: "",
    isBoosted: false,
    isUrgent: false,
  });
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X />
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          New Post
        </h3>
        <div className="space-y-4">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Location"
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500"
          />
          <textarea
            rows="3"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Details..."
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500"
          ></textarea>
          <div className="flex gap-2 text-sm font-bold">
            <div
              onClick={() =>
                setFormData({ ...formData, isBoosted: !formData.isBoosted })
              }
              className={`flex-1 border p-3 rounded-xl cursor-pointer flex items-center gap-2 transition-colors ${
                formData.isBoosted
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white"
              }`}
            >
              <CheckCircle
                className={`h-4 w-4 ${
                  formData.isBoosted ? "text-pink-500" : "text-gray-400"
                }`}
              />{" "}
              Pin Ad
            </div>
            <div
              onClick={() =>
                setFormData({ ...formData, isUrgent: !formData.isUrgent })
              }
              className={`flex-1 border p-3 rounded-xl cursor-pointer flex items-center gap-2 transition-colors ${
                formData.isUrgent
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white"
              }`}
            >
              <CheckCircle
                className={`h-4 w-4 ${
                  formData.isUrgent ? "text-red-500" : "text-gray-400"
                }`}
              />{" "}
              Urgent
            </div>
          </div>
          <button
            onClick={() => onSubmit(formData)}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl shadow-lg"
          >
            Post Now
          </button>
        </div>
      </div>
    </div>
  );
}
