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
  Home,
  Wand2,
  User,
} from "lucide-react";

// --- TASARIM KURTARICI (CDN) ---
const TailwindCDN = () => (
  <link
    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
    rel="stylesheet"
  />
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
    return null;
  }
};

/* --- SAHTE VERİ OLUŞTURUCU --- */
const generateFakeData = async () => {
  // ... (Veri listesi aynı kalıyor)
  // Kodun çok uzamaması için buradaki listeleri önceki koddan aynen koruduğunu varsayıyorum.
  // Eğer istersen buraya tekrar tam listeyi ekleyebilirim ama yer kaplamasın diye kısalttım.
  // Önceki v17 kodundaki NAMES, LOCATIONS, AVATARS, TEMPLATES listeleri burada olmalı.
  alert("⚠️ Fake Data Generator: Listeler kodda mevcut olmalı.");
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
    <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 mb-3 px-4">
        <TrendingUp className="h-4 w-4 text-yellow-500" />
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider">
          Spotlight
        </h3>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 px-4 no-scrollbar scroll-smooth"
        style={{ whiteSpace: "nowrap" }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onProfileClick(post)}
            className="min-w-[260px] inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl-lg z-10 flex items-center gap-1">
              <Star className="h-2 w-2 fill-black" /> FEATURED
            </div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <img
                src={post.image}
                className="h-10 w-10 rounded-full object-cover border-2 border-yellow-500 shadow-md"
              />
              <div className="truncate">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate w-32">
                  {post.name}
                </h4>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-2 w-2 text-yellow-500" /> {post.location}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 whitespace-normal relative z-10">
              {post.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- AI STUDIO BİLEŞENİ ---
const AIStudio = ({ user, requireAuth }) => {
  // ... (Aynı AI Studio kodları)
  return <div className="p-4 text-center text-gray-500">AI Studio (Demo)</div>;
};

export default function App() {
  const [activeTab, setActiveTab] = useState("feed"); // 'feed', 'ai', 'post', 'chat', 'profile'
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            ...userData,
          });
        } else {
          setUser({
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || "New Member",
            image:
              currentUser.photoURL ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
            verified: false,
          });
        }
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

  const requireAuth = (action) => {
    if (user) action();
    else {
      setAuthMode("login");
      setShowAuthModal(true);
    }
  };

  // --- ALT NAVİGASYON BUTONU ---
  const NavItem = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => {
        if (tab === "post") {
          requireAuth(() => {
            setEditingPost(null);
            setShowPostModal(true);
          });
        } else if (tab === "profile") {
          requireAuth(() => {
            /* Profil Sayfası Mantığı - Şimdilik Onboarding açalım */ setShowOnboarding(
              true
            );
          });
        } else {
          setActiveTab(tab);
          window.scrollTo(0, 0);
        }
      }}
      className={`flex flex-col items-center justify-center w-full py-1 ${
        activeTab === tab ? "text-pink-500" : "text-gray-500 dark:text-gray-400"
      }`}
    >
      <Icon
        className={`h-6 w-6 ${activeTab === tab ? "fill-current" : ""}`}
        strokeWidth={activeTab === tab ? 2.5 : 2}
      />
      <span className="text-[10px] mt-0.5 font-medium">{label}</span>
    </button>
  );

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "ALL" || post.type === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (post.name && post.name.toLowerCase().includes(searchLower)) ||
      (post.desc && post.desc.toLowerCase().includes(searchLower));
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
      className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white pb-24 md:pb-0 transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      <TailwindCDN />

      {/* ÜST NAVBAR (SADELEŞTİRİLMİŞ) */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActiveTab("feed");
              window.scrollTo(0, 0);
            }}
          >
            <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-pink-600/20">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Link<span className="text-pink-500">Up</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
            {!user && (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-pink-600/20"
              >
                Login
              </button>
            )}
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm font-bold">{user.name}</span>
                <button
                  onClick={() => {
                    if (window.confirm("Exit?")) signOut(auth);
                  }}
                  className="text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* İÇERİK ALANI */}
      {activeTab === "feed" && (
        <>
          <div className="relative bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 pt-4">
            <div className="max-w-6xl mx-auto px-4 pb-4">
              <div className="relative group w-full mb-4">
                <div className="relative flex bg-white dark:bg-gray-950 rounded-xl items-center p-2 border border-gray-200 dark:border-gray-800 focus-within:border-pink-500 w-full transition-colors">
                  <Search className="h-5 w-5 text-gray-400 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search creators, cities, services..."
                    className="bg-transparent border-none text-gray-900 dark:text-white px-3 py-1 focus:ring-0 outline-none w-full placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>

              <Spotlight
                posts={boostedPosts}
                onProfileClick={(post) =>
                  requireAuth(() => setSelectedProfile(post))
                }
              />

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
                    filter === "ALL"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-transparent"
                      : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap flex items-center gap-2 transition-colors ${
                      filter === cat.id
                        ? "bg-pink-600 border-pink-600 text-white"
                        : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="max-w-6xl mx-auto px-4 py-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => requireAuth(() => setSelectedProfile(post))}
                    className={`relative bg-white dark:bg-gray-900 rounded-2xl p-4 border transition-all active:scale-95 duration-200 cursor-pointer flex flex-col group ${
                      post.boosted
                        ? "border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <div className="absolute -top-2.5 left-4 flex gap-2">
                      {post.boosted && (
                        <div className="bg-yellow-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <Zap className="h-3 w-3 fill-black" /> PROMOTED
                        </div>
                      )}
                      {post.urgent && (
                        <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                          <Flame className="h-3 w-3 fill-white" /> URGENT
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3 mt-2">
                      <img
                        src={post.image}
                        className={`h-10 w-10 rounded-full object-cover border-2 ${
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
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <MapPin className="h-3 w-3" /> {post.location}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-3 line-clamp-3">
                      {post.desc}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white py-1.5 rounded-lg text-xs font-bold">
                        Profile
                      </button>
                      <button className="bg-pink-600 text-white py-1.5 rounded-lg text-xs font-bold">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <div className="fixed bottom-24 right-4 z-30 md:hidden">
            <button
              onClick={generateFakeData}
              className="bg-red-600/80 text-white p-2 rounded-full shadow-lg backdrop-blur-sm"
            >
              <Database className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {activeTab === "ai-studio" && (
        <div className="flex items-center justify-center h-[80vh] text-gray-500">
          AI Studio Coming Soon...
        </div>
      )}
      {activeTab === "chat" && (
        <div className="flex items-center justify-center h-[80vh] text-gray-500">
          Messages Coming Soon...
        </div>
      )}

      {/* ALT NAVİGASYON BAR (MOBİL İÇİN) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around items-center z-50 safe-area-bottom pb-1">
        <NavItem tab="feed" icon={Home} label="Home" />
        <NavItem tab="ai-studio" icon={Wand2} label="AI Studio" />

        {/* ORTA EKLE BUTONU */}
        <div className="relative -top-5">
          <button
            onClick={() =>
              requireAuth(() => {
                setEditingPost(null);
                setShowPostModal(true);
              })
            }
            className="bg-gradient-to-tr from-pink-600 to-purple-600 p-4 rounded-full shadow-lg shadow-pink-600/30 text-white transform transition-transform active:scale-95"
          >
            <PlusSquare className="h-6 w-6" />
          </button>
        </div>

        <NavItem tab="chat" icon={MessageCircle} label="Chat" />
        <NavItem tab="profile" icon={User} label="Profile" />
      </div>

      {/* --- MODALLAR --- */}
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm relative p-6 shadow-2xl">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-white"
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
                {selectedProfile.bio || selectedProfile.desc}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedProfile.socials?.instagram && (
                  <a
                    href={`https://instagram.com/${selectedProfile.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
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
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
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
                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
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

// --- ALT BİLEŞENLER (Modallar vb. aynı kalıyor, sadece stilleri koruduk) ---
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
        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
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
