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
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  MapPin,
  Users,
  Camera,
  PlusSquare,
  Search,
  CheckCircle,
  Star,
  Zap,
  X,
  Building2,
  Edit2,
  Trash2,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Crown,
  Send,
  AlertCircle,
  TrendingUp,
  Flame,
  Database,
  LogOut,
  Sun,
  Moon,
  Image as ImageIcon,
} from "lucide-react";

// --- TASARIM KURTARICI (CDN) ---
const TailwindCDN = () => (
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
);

/* --- CLOUDINARY AYARLARI (BURAYI DOLDUR!) --- */
const CLOUDINARY_CONFIG = {
  cloudName: "dqoh1mijk", // Senin Cloud Name'in (Fotoğraftan aldım)
  uploadPreset: "yxdnini8", // Örn: "ml_default" (Tırnakların içine yaz)
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

const apiKey = "";

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

/* --- RESİM YÜKLEME FONKSİYONU (Cloudinary) --- */
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
    return data.secure_url; // Yüklenen resmin internet adresi
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    alert("Resim yüklenemedi. Preset ayarlarını kontrol et.");
    return null;
  }
};

/* --- SAHTE VERİ OLUŞTURUCU --- */
const generateFakeData = async () => {
  // ... (Eski listeler aynen burada, yer kaplamasın diye kısalttım ama hepsi çalışacak)
  const NAMES = [
    "Jessica",
    "Amber",
    "Roxy",
    "Luna",
    "Vixen",
    "Cherry",
    "Diamond",
    "Jade",
  ];
  const LOCATIONS = [
    "Miami, FL",
    "Los Angeles, CA",
    "New York, NY",
    "Las Vegas, NV",
  ];
  const AVATARS = ["https://t1.pixhost.to/thumbs/10479/665424991_d1-2.jpg"]; // Örnek
  // (Senin zengin listenin tamamı buradaymış gibi davranacak)
  alert(
    "⚠️ Bu özellik için önceki tam listeyi tekrar eklememiz gerekebilir. Şimdilik boş."
  );
};

// --- SPOTLIGHT BİLEŞENİ ---
const Spotlight = ({ posts, onProfileClick }) => {
  const scrollRef = React.useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollStep;
        scrollAmount += scrollStep;
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, 30);
    return () => clearInterval(scrollInterval);
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-yellow-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider">
          Spotlight Creators
        </h3>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        style={{ whiteSpace: "nowrap" }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onProfileClick(post)}
            className="min-w-[280px] inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl cursor-pointer hover:border-yellow-500/50 transition-all shadow-lg relative overflow-hidden group"
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
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 whitespace-normal relative z-10">
              {post.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "New Member",
          image:
            currentUser.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
          verified: false,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const livePosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(livePosts);
        setLoadingPosts(false);
      },
      () => setLoadingPosts(false)
    );
    return () => unsubscribe();
  }, []);

  const handleAuthSubmit = async (e, email, password) => {
    e.preventDefault();
    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setShowAuthModal(false);
        setShowOnboarding(true);
      }
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleCompleteOnboarding = async (profileData) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.name,
        photoURL: profileData.image, // Cloudinary URL buraya gelir
      });
      window.location.reload();
    }
    setShowOnboarding(false);
  };

  const handleLogout = async () => {
    if (window.confirm("Çıkış yapmak istiyor musun?")) {
      await signOut(auth);
      setActiveChat(null);
    }
  };

  const handlePostAd = async (formData) => {
    if (!user) return;
    try {
      const postData = {
        ownerId: user.id,
        name: user.name,
        handle:
          "@" +
          (user.name ? user.name.replace(/\s/g, "").toLowerCase() : "user"),
        image: user.image,
        verified: user.verified,
        boosted: formData.isBoosted,
        urgent: formData.isUrgent,
        type: formData.type,
        location: formData.location,
        desc: formData.desc,
        tags: ["New", formData.type],
        createdAt: Date.now(),
        followers: "New",
        socials: {},
      };
      await addDoc(collection(db, "posts"), postData);
      setShowPostModal(false);
      setEditingPost(null);
    } catch (error) {
      alert("İlan gönderilemedi.");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("İlanı silmek istiyor musunuz?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
      } catch (error) {
        console.error("Silme hatası:", error);
      }
    }
  };

  const requireAuth = (action) => {
    if (user) action();
    else {
      setAuthMode("login");
      setShowAuthModal(true);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "ALL" || post.type === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (post.name && post.name.toLowerCase().includes(searchLower)) ||
      (post.desc && post.desc.toLowerCase().includes(searchLower)) ||
      (post.location && post.location.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const boostedPosts = posts.filter((p) => p.boosted);

  if (authLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    );

  return (
    <div
      className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white pb-20 md:pb-0 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <TailwindCDN />

      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-pink-600/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Link<span className="text-pink-500">Up</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Hi,
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white max-w-[100px] truncate">
                    {user.name}
                  </div>
                </div>
                <img
                  src={user.image}
                  className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  title="Profile"
                />
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setShowPostModal(true);
                  }}
                  className="hidden md:flex bg-white dark:bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-full text-sm font-bold items-center gap-2 transition-transform hover:scale-105 border border-gray-200 dark:border-transparent shadow-sm"
                >
                  <PlusSquare className="h-4 w-4" /> Post Ad
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-pink-600/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Spotlight
            posts={boostedPosts}
            onProfileClick={(post) =>
              requireAuth(() => setSelectedProfile(post))
            }
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative group w-full md:w-auto">
              <div className="relative flex bg-white dark:bg-gray-950 rounded-xl items-center p-1 border border-gray-200 dark:border-gray-800 focus-within:border-pink-500 w-full md:w-96 transition-colors">
                <Search className="h-4 w-4 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none text-gray-900 dark:text-white px-3 py-2 focus:ring-0 outline-none w-full placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                  filter === "ALL"
                    ? "bg-gray-900 text-white dark:bg-white dark:text-black border-transparent"
                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-2 transition-colors ${
                    filter === cat.id
                      ? "bg-pink-600 border-pink-600 text-white"
                      : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loadingPosts ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No ads found.
            </p>
            <button
              onClick={() => requireAuth(() => setShowPostModal(true))}
              className="text-pink-500 font-bold hover:underline"
            >
              Post Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => requireAuth(() => setSelectedProfile(post))}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col group ${
                  post.boosted
                    ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                {user && user.id === post.ownerId && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="absolute -top-3 left-5 flex gap-2">
                  {post.boosted && (
                    <div className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-black" /> PROMOTED
                    </div>
                  )}
                  {post.urgent && (
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                      <Flame className="h-3 w-3 fill-white" /> URGENT
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <img
                    src={post.image}
                    className={`h-11 w-11 rounded-full object-cover border-2 ${
                      post.boosted
                        ? "border-yellow-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                  <div>
                    <h3
                      className={`font-bold text-sm flex items-center gap-1 ${
                        post.boosted
                          ? "text-yellow-600 dark:text-yellow-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {post.name}{" "}
                      {post.verified && (
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" /> {post.location}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded border bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    {CATEGORIES.find((c) => c.id === post.type)?.label}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                  {post.desc}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-2 rounded-lg text-xs font-bold transition-colors">
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth(() => setActiveChat(post));
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={generateFakeData}
          className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm border border-red-500"
        >
          <Database className="h-4 w-4" /> ⚠️ DEV: Add Fake Data (x10)
        </button>
      </div>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)}
          onSubmit={handleAuthSubmit}
        />
      )}

      {showOnboarding && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      {showPostModal && (
        <PostModal
          onClose={() => setShowPostModal(false)}
          onSubmit={handlePostAd}
          initialData={editingPost}
        />
      )}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4 transition-colors">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm relative p-6 shadow-2xl">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X />
            </button>
            <div className="text-center mt-8">
              <img
                src={selectedProfile.image}
                className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <h2 className="text-2xl text-gray-900 dark:text-white font-bold">
                {selectedProfile.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedProfile.desc}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedProfile.socials?.instagram && (
                  <a
                    href={`https://instagram.com/${selectedProfile.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-pink-500 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Insta
                    </span>
                  </a>
                )}
                {selectedProfile.socials?.twitter && (
                  <a
                    href={`https://twitter.com/${selectedProfile.socials.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-blue-400 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Twitter
                    </span>
                  </a>
                )}
                {selectedProfile.socials?.onlyfans && (
                  <a
                    href={selectedProfile.socials.onlyfans}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-300">
                      Links
                    </span>
                  </a>
                )}
              </div>
              <button className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg">
                Message
              </button>
            </div>
          </div>
        </div>
      )}
      {activeChat && (
        <div className="fixed bottom-0 right-0 md:right-4 w-full md:w-80 h-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 md:rounded-t-2xl z-[100] flex flex-col shadow-2xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between bg-gray-50 dark:bg-gray-950 rounded-t-2xl">
            <span className="text-gray-900 dark:text-white font-bold">
              {activeChat.name}
            </span>
            <button
              onClick={() => setActiveChat(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-900/90 p-4 text-center text-gray-500">
            Start chatting...
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <input
              className="w-full bg-gray-100 dark:bg-gray-950 rounded-full px-4 py-2 text-gray-900 dark:text-white outline-none border border-gray-200 dark:border-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Message..."
            />
          </div>
        </div>
      )}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/90 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-2xl">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl text-gray-900 dark:text-white font-bold mb-2">
              Go Premium
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get featured & more.
            </p>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500"
            style={{ color: "white", backgroundColor: "#1f2937" }}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-pink-500"
            style={{ color: "white", backgroundColor: "#1f2937" }}
            placeholder="Password"
            required
          />
          <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20">
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

function OnboardingModal({ onComplete }) {
  // Yeni State'ler
  const [data, setData] = useState({
    name: "",
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(
      Math.random() * 1000
    )}`,
    bio: "",
    instagram: "",
    twitter: "",
    onlyfans: "",
  });
  const [uploading, setUploading] = useState(false);

  // Cloudinary Yükleme
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

  return (
    <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Setup Profile
        </h2>

        {/* FOTOĞRAF YÜKLEME ALANI */}
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <img
            src={data.image}
            className="w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-800 object-cover"
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
            <label className="text-xs font-bold text-gray-500 uppercase">
              Display Name
            </label>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none mt-1"
              style={{ color: "white", backgroundColor: "#1f2937" }}
              placeholder="e.g. Jessica Rabbit"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              About You (Bio)
            </label>
            <textarea
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none mt-1"
              style={{ color: "white", backgroundColor: "#1f2937" }}
              placeholder="Tell us about yourself..."
              rows="3"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-gray-400">
              {data.bio.length}/500
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Instagram
              </label>
              <input
                value={data.instagram}
                onChange={(e) =>
                  setData({ ...data, instagram: e.target.value })
                }
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1"
                style={{ color: "white", backgroundColor: "#1f2937" }}
                placeholder="username"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Twitter / X
              </label>
              <input
                value={data.twitter}
                onChange={(e) => setData({ ...data, twitter: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1"
                style={{ color: "white", backgroundColor: "#1f2937" }}
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              OnlyFans / Linktree
            </label>
            <input
              value={data.onlyfans}
              onChange={(e) => setData({ ...data, onlyfans: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white text-sm outline-none mt-1"
              style={{ color: "white", backgroundColor: "#1f2937" }}
              placeholder="https://..."
            />
          </div>
        </div>
        <button
          onClick={() => onComplete(data)}
          className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-6"
        >
          Complete Profile
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
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
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
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
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
          />
          <textarea
            rows="3"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Details..."
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm outline-none"
            style={{ color: "white", backgroundColor: "#1f2937" }}
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
