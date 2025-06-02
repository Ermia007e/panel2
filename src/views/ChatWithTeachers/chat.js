import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { db, auth } from "./firebase-config";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { gsap } from "gsap";
import { toast, Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";

const customStyles = `
  :root {
    --bg-color: #f7fafc;
    --bg-primary: #ffffff;
    --bg-secondary: #edf2f7;
    --text-color: #2d3748;
    --text-secondary: #718096;
    --bubble-sent: #333333;
    --bubble-received: #e2e8f0;
    --accent-color: #333333;
    --custom-bubble-color: #333333;
    --custom-bg-color: #f7fafc;
    --custom-bg-image: none;
  }

  .dark-mode-root {
    --bg-color: #1a202c;
    --bg-primary: #2d3748;
    --bg-secondary: #4a5568;
    --text-color: #e2e8f0;
    --text-secondary: #a0aec0;
    --bubble-received: #2d3748;
    --accent-color: #333333;
  }

  .theme-telegram { --custom-bubble-color: #333333; --accent-color: #333333; }
  .theme-whatsapp { --custom-bubble-color: #333333; --accent-color: #25D366; }
  .theme-imessage { --custom-bubble-color: #333333; --accent-color: #333333; }

  body {
    font-family: -apple-system, Inter, Roboto, sans-serif;
    direction: rtl;
    text-align: right;
    background-color: var(--bg-color);
    margin: 0;
    overflow-x: hidden;
  }

  .user-list-panel {
    background-color: var(--bg-primary);
    border-left: 1px solid rgba(0,0,0,0.08);
    transition: all 0.3s ease;
    box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  }
  .dark-mode-root .user-list-panel {
    border-color: rgba(255,255,255,0.15);
  }
  .user-list-item {
    padding: 12px 15px;
    margin: 5px 10px;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  .user-list-item:hover {
    background-color: var(--bg-secondary);
    transform: translateX(-2px);
  }
  .user-list-item.active {
    background-color: var(--accent-color) !important;
    color: white !important;
  }
  .online-dot {
    width: 8px;
    height: 8px;
    background-color: #38a169;
    border-radius: 50%;
    position: absolute;
    bottom: 10px;
    right: 15px;
    border: 2px solid var(--bg-primary);
  }

  .profile-avatar-lg {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid var(--accent-color);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  .profile-avatar-lg:hover {
    transform: scale(1.08);
  }
  .profile-avatar-sm {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid var(--bg-primary);
  }

  .bubble-container {
    background-color: var(--custom-bg-color);
    background-image: var(--custom-bg-image);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: background-color 0.3s ease;
  }
  .message-bubble {
    padding: 12px 18px;
    border-radius: 20px;
    max-width: 75%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    position: relative;
    margin: 5px 10px;
    word-break: break-word;
  }
  .justify-content-end .message-bubble {
    background-color: var(--custom-bubble-color);
    color: white;
    border-bottom-right-radius: 5px;
  }
  .justify-content-start .message-bubble {
    background-color: var(--bubble-received);
    color: var(--text-color);
    border-bottom-left-radius: 5px;
  }
  .message-timestamp {
    font-size: 0.7em;
    opacity: 0.8;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .message-actions .btn {
    padding: 2px 8px;
    font-size: 0.65em;
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .message-bubble:hover .message-actions .btn {
    opacity: 1;
  }
  .link-preview {
    background-color: var(--bg-primary);
    border-radius: 12px;
    padding: 8px;
    margin-top: 8px;
    border-left: 3px solid var(--accent-color);
  }
  .link-preview img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 4px;
  }

  .chat-input {
    background-color: var(--bg-primary);
    padding: 12px;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
    border-top: 1px solid rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .form-control {
    border-radius: 25px;
    background-color: var(--bg-secondary);
    border: none;
    padding: 10px 20px;
    color: var(--text-color);
    transition: all 0.3s ease;
  }
  .form-control:focus {
    background-color: var(--bg-primary);
    box-shadow: 0 0 0 2px var(--accent-color);
  }

  .modal-content {
    border-radius: 18px;
    background-color: var(--bg-primary);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    border: none;
  }
  .modal-backdrop {
    backdrop-filter: blur(5px);
  }

  .emoji-toggle-button {
    border: none;
    background: transparent;
    font-size: 1.3em;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  .emoji-toggle-button:hover {
    background-color: var(--bg-secondary);
    transform: scale(1.15);
  }
  .emoji-picker-popup {
    position: absolute;
    bottom: 70px;
    left: 15px;
    z-index: 1050;
    border-radius: 15px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    background-color: var(--bg-primary);
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.3s ease;
  }
  .emoji-picker-popup.show {
    opacity: 1;
    transform: translateY(0);
  }

  .unread-badge {
    background-color: #e53e3e;
    color: white;
    font-size: 0.65em;
    padding: 4px 10px;
    border-radius: 15px;
    margin-right: 8px;
    font-weight: 600;
  }
  .new-message-highlight {
    animation: pulse 1.2s infinite;
  }
  @keyframes pulse {
    0% { background-color: var(--bg-secondary); }
    50% { background-color: var(--accent-color); }
    100% { background-color: var(--bg-secondary); }
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    background-color: var(--bg-primary);
    border-radius: 15px;
    margin: 5px 10px;
  }
  .typing-dot {
    width: 7px;
    height: 7px;
    background-color: var(--accent-color);
    border-radius: 50%;
    animation: typing 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.3s; }
  .typing-dot:nth-child(3) { animation-delay: 0.6s; }
  @keyframes typing {
    0%, 20% { transform: translateY(0); opacity: 1; }
    40% { transform: translateY(-6px); opacity: 0.5; }
    60%, 100% { transform: translateY(0); opacity: 1; }
  }

  .fullscreen-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  .fullscreen-image img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 10px;
  }
`;

function useDarkMode() {
  const skin = useSelector((state) => state.layout?.skin);
  return skin === "dark";
}
const generateAvatarUrl = (nameOrEmail) => {
  const name = nameOrEmail ? nameOrEmail.split("@")[0] : "کاربر ناشناس";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333333&color=fff&size=50`;
};

const fetchLinkPreview = async (url) => {
  try {
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return {
      title: data.data.title,
      description: data.data.description,
      image: data.data.image?.url,
      url: data.data.url,
    };
  } catch {
    return null;
  }
};

const Chat = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [chatBubbleColor, setChatBubbleColor] = useState("#333333");
  const [chatBackgroundColor, setChatBackgroundColor] = useState("#f7fafc");
  const [chatBackgroundImageUrl, setChatBackgroundImageUrl] = useState("");
  const [chatBackgroundImagePreview, setChatBackgroundImagePreview] = useState("");
  const [userCustomizations, setUserCustomizations] = useState({
    chatBubbleColor: "#333333",
    chatBackgroundColor: "#f7fafc",
    chatBackgroundImage: "",
    theme: "telegram",
  });
  const [savingCustomization, setSavingCustomization] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);
  const [linkPreviews, setLinkPreviews] = useState({});

  const messagesEndRef = useRef(null);
  const chatDisplayRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const darkMode = useDarkMode();
  const notificationSound = useRef(new Audio("https://cdn.pixabay.com/audio/2022/03/24/audio_4b5b8c4c1b.mp3"));

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--custom-bubble-color", userCustomizations.chatBubbleColor);
    document.documentElement.style.setProperty("--custom-bg-color", userCustomizations.chatBackgroundColor);
    document.documentElement.style.setProperty(
      "--custom-bg-image",
      userCustomizations.chatBackgroundImage ? `url("${userCustomizations.chatBackgroundImage}")` : "none"
    );
  }, [userCustomizations]);

  useLayoutEffect(() => {
    if (chatDisplayRef.current) {
      gsap.fromTo(
        chatDisplayRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [selectedChat]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const defaultDisplayName = currentUser.displayName || currentUser.email.split("@")[0];
        const defaultPhotoURL = currentUser.photoURL || generateAvatarUrl(currentUser.email);

        setNewDisplayName(defaultDisplayName);
        setProfileImageUrl(defaultPhotoURL);
        setProfileImagePreview(defaultPhotoURL);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          let userData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: defaultDisplayName,
            profilePicture: defaultPhotoURL,
            lastSeen: serverTimestamp(),
            chatBubbleColor: "#333333",
            chatBackgroundColor: "#f7fafc",
            chatBackgroundImage: "",
            theme: "telegram",
          };

          if (userSnap.exists()) {
            const existingData = userSnap.data();
            userData = { ...userData, ...existingData };
            setChatBubbleColor(existingData.chatBubbleColor || "#333333");
            setChatBackgroundColor(existingData.chatBackgroundColor || "#f7fafc");
            setChatBackgroundImageUrl(existingData.chatBackgroundImage || "");
            setChatBackgroundImagePreview(existingData.chatBackgroundImage || "");
            setUserCustomizations({
              chatBubbleColor: existingData.chatBubbleColor || "#333333",
              chatBackgroundColor: existingData.chatBackgroundColor || "#f7fafc",
              chatBackgroundImage: existingData.chatBackgroundImage || "",
              theme: existingData.theme || "telegram",
            });
          } else {
            await setDoc(userRef, userData);
          }

          if (currentUser.displayName !== userData.displayName || currentUser.photoURL !== userData.profilePicture) {
            await updateProfile(currentUser, {
              displayName: userData.displayName,
              photoURL: userData.profilePicture.length <= 2048 ? userData.profilePicture : generateAvatarUrl(userData.displayName),
            });
          }
        } catch (err) {
          toast.error(`خطا در بارگذاری اطلاعات کاربر: ${err.message}`);
        }
      } else {
        setNewDisplayName("");
        setProfileImageUrl("");
        setProfileImagePreview("");
        setChatBackgroundImageUrl("");
        setChatBackgroundImagePreview("");
        setUserCustomizations({});
        setSelectedChat(null);
        setMessages([]);
        setEditingMessage(null);
        setEditedMessageText("");
        setUnreadMessages({});
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      return;
    }

    const q = query(collection(db, "users"), orderBy("displayName", "asc"));
    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllUsers(usersList);
    }, (err) => {
      toast.error(`خطا در بارگذاری کاربران: ${err.message}`);
    });

    return () => unsubscribeUsers();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadMessages({});
      return;
    }

    const chatsRef = collection(db, "chats");
    const unsubscribeChats = onSnapshot(chatsRef, (snapshot) => {
      const unreadCounts = {};
      snapshot.docs.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(user.uid)) {
          const messagesRef = collection(db, "chats", doc.id, "messages");
          const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
          onSnapshot(messagesQuery, (msgSnapshot) => {
            let unreadCount = 0;
            msgSnapshot.forEach((msgDoc) => {
              const msgData = msgDoc.data();
              if (msgData.senderId !== user.uid && (!msgData.readBy || !msgData.readBy.includes(user.uid))) {
                unreadCount++;
                if (msgSnapshot.size === unreadCount) {
                  notificationSound.current.play().catch(() => {});
                }
              }
            });
            unreadCounts[doc.id] = unreadCount;
            setUnreadMessages({ ...unreadCounts });
          });
        }
      });
    }, (err) => {
      toast.error(`خطا در بارگذاری اعلان‌ها: ${err.message}`);
    });

    return () => unsubscribeChats();
  }, [user]);
  useEffect(() => {
    if (!selectedChat?.chatId) {
      setMessages([]);
      return;
    }

    const messagesCollectionRef = collection(db, "chats", selectedChat.chatId, "messages");
    const q = query(messagesCollectionRef, orderBy("timestamp", "asc"));

    const unsubscribeMessages = onSnapshot(q, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);

      const newLinkPreviews = {};
      for (const message of fetchedMessages) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.text.match(urlRegex);
        if (urls) {
          for (const url of urls) {
            if (!linkPreviews[message.id]?.[url]) {
              const preview = await fetchLinkPreview(url);
              if (preview) {
                newLinkPreviews[message.id] = { ...newLinkPreviews[message.id], [url]: preview };
              }
            }
          }
        }
      }
      setLinkPreviews((prev) => ({ ...prev, ...newLinkPreviews }));

      snapshot.docs.forEach(async (doc) => {
        const msgData = doc.data();
        if (msgData.senderId !== user.uid && (!msgData.readBy || !msgData.readBy.includes(user.uid))) {
          await updateDoc(doc.ref, {
            readBy: [...(msgData.readBy || []), user.uid],
          });
        }
      });
    }, (err) => {
      toast.error(`خطا در بارگذاری پیام‌ها: ${err.message}`);
    });

    return () => unsubscribeMessages();
  }, [selectedChat, user, linkPreviews]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !event.target.closest(".emoji-toggle-button")) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!selectedChat || !newMessage) return;
    const typingTimeout = setTimeout(() => setIsTyping(false), 1000);
    setIsTyping(true);
    return () => clearTimeout(typingTimeout);
  }, [newMessage, selectedChat]);

  const handleSignUp = useCallback(async () => {
    if (!email || !password) {
      toast.error("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const defaultPhotoURL = generateAvatarUrl(email);
      await updateProfile(userCredential.user, {
        displayName: email.split("@")[0],
        photoURL: defaultPhotoURL,
      });
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.email.split("@")[0],
        profilePicture: defaultPhotoURL,
        lastSeen: serverTimestamp(),
        chatBubbleColor: "#333333",
        chatBackgroundColor: "#f7fafc",
        chatBackgroundImage: "",
        theme: "telegram",
      });
      toast.success("ثبت‌نام با موفقیت انجام شد!");
      setEmail("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(`خطا در ثبت‌نام: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  }, [email, password]);

  const handleSignIn = useCallback(async () => {
    if (!email || !password) {
      toast.error("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("ورود با موفقیت انجام شد!");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(`خطا در ورود: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  }, [email, password]);

  const confirmLogout = useCallback(() => {
    setModalAction("logout");
    setShowConfirmModal(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      setSelectedChat(null);
      toast.success("با موفقیت خارج شدید!");
    } catch (err) {
      toast.error(`خطا در خروج: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handlePasswordReset = useCallback(async () => {
    if (!email.trim()) {
      toast.error("لطفاً ایمیل خود را وارد کنید.");
      return;
    }
    setAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("لینک بازنشانی رمز عبور ارسال شد!");
      setEmail("");
    } catch (err) {
      toast.error("خطا در ارسال ایمیل بازنشانی: " + err.message);
      toast.error(`خطا در ارسال ایمیل بازنشانی: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  }, [email]);

  const handleProfileImageUrlChange = useCallback((e) => {
    const url = e.target.value;
    if (url.length > 2048) {
      toast.error("لینک تصویر پروفایل بیش از حد طولانی است (حداکثر 2048 کاراکتر).");
      return;
    }
    setProfileImageUrl(url);
    setProfileImagePreview(url || generateAvatarUrl(newDisplayName || user?.displayName || user?.email));
  }, [newDisplayName, user]);

  const handleClearProfileImage = useCallback(() => {
    setProfileImageUrl("");
    setProfileImagePreview(generateAvatarUrl(newDisplayName || user?.displayName || user?.email));
  }, [newDisplayName, user]);

  const handleUpdateProfile = useCallback(async () => {
    if (!user) {
      toast.error("ابتدا باید وارد شوید.");
      return;
    }
    if (!newDisplayName.trim()) {
      toast.error("نام نمایشی نمی‌تواند خالی باشد.");
      return;
    }
    if (profileImageUrl.length > 2048) {
      toast.error("لینک تصویر پروفایل بیش از حد طولانی است (حداکثر 2048 کاراکتر).");
      return;
    }

    setUpdatingProfile(true);
    try {
      const photoURLToSave = profileImageUrl || generateAvatarUrl(newDisplayName || user.email);
      await updateProfile(user, {
        displayName: newDisplayName,
        photoURL: photoURLToSave.length <= 2048 ? photoURLToSave : generateAvatarUrl(newDisplayName),
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: newDisplayName,
        profilePicture: photoURLToSave,
      });

      toast.success("پروفایل با موفقیت به‌روزرسانی شد!");
      setShowProfileModal(false);
    } catch (err) {
      toast.error("خطا در به‌روزرسانی پروفایل: " + err.message);
      toast.error(`خطا در به‌روزرسانی پروفایل: ${err.message}`);
    } finally {
      setUpdatingProfile(false);
    }
  }, [user, newDisplayName, profileImageUrl]);

  const handleChatBackgroundImageUrlChange = useCallback((e) => {
    const url = e.target.value;
    setChatBackgroundImageUrl(url);
    setChatBackgroundImagePreview(url);
  }, []);

  const handleClearChatBackgroundImage = useCallback(() => {
    setChatBackgroundImageUrl("");
    setChatBackgroundImagePreview("");
  }, []);

  const handleSaveCustomization = useCallback(async () => {
    if (!user) {
      toast.error("ابتدا باید وارد شوید.");
      return;
    }
    setSavingCustomization(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const newCustomizations = {
        chatBubbleColor,
        chatBackgroundColor,
        chatBackgroundImage: chatBackgroundImageUrl || "",
        theme: userCustomizations.theme,
      };
      await updateDoc(userRef, newCustomizations);
      setUserCustomizations(newCustomizations);
      toast.success("تنظیمات چت ذخیره شد!");
      setShowCustomizationModal(false);
    } catch (err) {
      toast.error("خطا در ذخیره تنظیمات: " + err.message);
      toast.error(`خطا در ذخیره تنظیمات: ${err.message}`);
    } finally {
      setSavingCustomization(false);
    }
  }, [user, chatBubbleColor, chatBackgroundColor, chatBackgroundImageUrl, userCustomizations.theme]);

  const handleSelectChat = useCallback(async (targetUser) => {
    if (!user || !targetUser || !targetUser.uid) {
      toast.error("کاربر یا کاربر هدف معتبر نیست.");
      return;
    }
    setEditingMessage(null);
    setEditedMessageText("");

    let chatId;
    let isSelfChat = false;

    try {
      if (targetUser.uid === user.uid) {
        chatId = user.uid;
        isSelfChat = true;
      } else {
        const chatParticipants = [user.uid, targetUser.uid].sort();
        chatId = chatParticipants.join("_");
      }

      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const participants = chatSnap.data().participants || [];
        if (!participants.includes(user.uid)) {
          await updateDoc(chatRef, {
            participants: isSelfChat ? [user.uid] : [user.uid, targetUser.uid],
          });
        }
      } else {
        await setDoc(chatRef, {
          participants: isSelfChat ? [user.uid] : [user.uid, targetUser.uid],
          createdAt: serverTimestamp(),
          lastMessage: "",
          lastMessageTimestamp: null,
          readBy: [],
        });
      }

      setSelectedChat({
        chatId: chatId,
        targetUser: targetUser,
        isSelfChat: isSelfChat,
      });
      setNewMessage("");
      setShowEmojiPicker(false);
    } catch (e) {
      toast.error("خطا در شروع چت: " + e.message);
      toast.error(`خطا در شروع چت: ${e.message}`);
    }
  }, [user]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) {
      toast.error("پیام نمی‌تواند خالی باشد.");
      return;
    }
    if (!user || !selectedChat?.chatId) {
      toast.error("لطفاً وارد شوید و چتی را انتخاب کنید.");
      return;
    }

    setSendingMessage(true);
    try {
      const chatMessagesRef = collection(db, "chats", selectedChat.chatId, "messages");
      await addDoc(chatMessagesRef, {
        text: newMessage,
        timestamp: serverTimestamp(),
        senderId: user.uid,
        senderName: user.displayName || user.email.split("@")[0],
        senderPhotoURL: user.photoURL || generateAvatarUrl(user.email),
        readBy: [user.uid],
      });

      const chatDocRef = doc(db, "chats", selectedChat.chatId);
      await updateDoc(chatDocRef, {
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
      });

      setNewMessage("");
      setShowEmojiPicker(false);
    } catch (e) {
      toast.error("خطا در ارسال پیام: " + e.message);
      toast.error(`خطا در ارسال پیام: ${e.message}`);
    } finally {
      setSendingMessage(false);
    }
  }, [user, selectedChat, newMessage]);

  const handleEditMessage = useCallback((message) => {
    setEditingMessage(message);
    setEditedMessageText(message.text);
  }, []);

  const saveEditedMessage = useCallback(async () => {
    if (!editedMessageText.trim()) {
      toast.error("پیام ویرایش شده نمی‌تواند خالی باشد!");
      return;
    }
    if (!user || !selectedChat?.chatId || !editingMessage) {
      toast.error("خطا: پیام یا چت برای ویرایش انتخاب نشده است.");
      return;
    }
    setSendingMessage(true);
    try {
      const messageRef = doc(db, "chats", selectedChat.chatId, "messages", editingMessage.id);
      await updateDoc(messageRef, {
        text: editedMessageText,
        edited: true,
        timestamp: serverTimestamp(),
      });

      const chatDocRef = doc(db, "chats", selectedChat.chatId);
      const chatSnap = await getDoc(chatDocRef);
      if (chatSnap.exists() && chatSnap.data().lastMessage === editingMessage.text) {
        await updateDoc(chatDocRef, {
          lastMessage: editedMessageText,
          lastMessageTimestamp: serverTimestamp(),
        });
      }

      toast.success("پیام با موفقیت ویرایش شد!");
      setEditingMessage(null);
      setEditedMessageText("");
    } catch (e) {
      toast.error(`خطا در ویرایش پیام: ${e.message}`);
    } finally {
      setSendingMessage(false);
    }
  }, [user, selectedChat, editingMessage, editedMessageText]);

  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
    setEditedMessageText("");
  }, []);

  const confirmDeleteMessage = useCallback((messageId) => {
    setMessageToDeleteId(messageId);
    setModalAction("deleteMessage");
    setShowConfirmModal(true);
  }, []);

  const deleteMessage = useCallback(async () => {
    if (!user || !selectedChat?.chatId || !messageToDeleteId) {
      toast.error("خطا: پیام یا چت برای حذف انتخاب نشده است.");
      return;
    }
    setSendingMessage(true);
    try {
      const messageRef = doc(db, "chats", selectedChat.chatId, "messages", messageToDeleteId);
      await deleteDoc(messageRef);
      toast.success("پیام با موفقیت حذف شد!");

      const chatDocRef = doc(db, "chats", selectedChat.chatId);
      const q = query(collection(db, "chats", selectedChat.chatId, "messages"), orderBy("timestamp", "desc"), limit(1));
      const lastMessageSnap = await getDocs(q);
      if (!lastMessageSnap.empty) {
        const latestMessage = lastMessageSnap.docs[0].data();
        await updateDoc(chatDocRef, {
          lastMessage: latestMessage.text,
          lastMessageTimestamp: latestMessage.timestamp,
        });
      } else {
        await updateDoc(chatDocRef, {
          lastMessage: "",
          lastMessageTimestamp: null,
        });
      }
    } catch (e) {
      toast.error(`خطا در حذف پیام: ${e.message}`);
    } finally {
      setSendingMessage(false);
      setMessageToDeleteId(null);
    }
  }, [user, selectedChat, messageToDeleteId]);

  const handleModalConfirm = useCallback(async () => {
    setShowConfirmModal(false);
    if (modalAction === "logout") {
      await handleSignOut();
    } else if (modalAction === "deleteMessage") {
      await deleteMessage();
    }
    setModalAction(null);
    setMessageToDeleteId(null);
  }, [modalAction, handleSignOut, deleteMessage]);

  const handleModalCancel = useCallback(() => {
    setShowConfirmModal(false);
    setModalAction(null);
    setMessageToDeleteId(null);
  }, []);

  const handleEmojiClick = useCallback((emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        saveEditedMessage();
      } else {
        sendMessage();
      }
    }
  }, [editingMessage, saveEditedMessage, sendMessage]);

  const handleThemeChange = useCallback((theme) => {
    setUserCustomizations((prev) => ({ ...prev, theme }));
  }, []);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((u) => u.id !== user?.uid)
      .filter(
        (u) =>
          u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allUsers, user, searchTerm]);

  if (loading) {
    return (
      <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? "dark-mode-root" : "light-mode-root"}`}>
        <div className="spinner-border" style={{ color: userCustomizations.chatBubbleColor }} role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-100 ${darkMode ? "dark-mode-root" : "light-mode-root"} ${userCustomizations.theme}`}>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {fullscreenImage && (
        <div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="تصویر تمام‌صفحه" />
        </div>
      )}

      {!user ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-md-5 col-lg-4 p-4 rounded shadow-lg" style={{ backgroundColor: darkMode ? "#2d3748" : "#ffffff" }}>
            <h2 className={`text-center mb-4 ${darkMode ? "text-light" : "text-dark"}`}>پیام‌رسان حرفه‌ای</h2>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">ایمیل</label>
              <input
                type="email"
                id="emailInput"
                className="form-control"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label">رمز عبور</label>
              <input
                type="password"
                id="passwordInput"
                className="form-control"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mb-3">
              <button className={`btn btn-primary ${authLoading ? "disabled" : ""}`} onClick={handleSignIn} disabled={authLoading}>
                {authLoading ? "در حال ورود..." : "ورود"}
              </button>
              <button className={`btn btn-outline-primary ${authLoading ? "disabled" : ""}`} onClick={handleSignUp} disabled={authLoading}>
                {authLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
              </button>
            </div>
            <p className="text-center">
              <button className="btn btn-link text-muted" onClick={handlePasswordReset}>
                فراموشی رمز عبور؟
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="d-flex h-100">
          <div className="col-md-3 d-flex flex-column user-list-panel">
            <div className="p-3 border-bottom d-flex align-items-center">
              <img
                src={user.photoURL || generateAvatarUrl(user.displayName || user.email)}
                alt="پروفایل"
                className="profile-avatar-sm"
                onClick={() => {
                  setNewDisplayName(user.displayName || user.email.split("@")[0]);
                  setProfileImageUrl(user.photoURL || generateAvatarUrl(user.email));
                  setProfileImagePreview(user.photoURL || generateAvatarUrl(user.email));
                  setShowProfileModal(true);
                }}
                style={{ cursor: "pointer" }}
                title="ویرایش پروفایل"
              />
              <h5 className={`mb-0 flex-grow-1 ${darkMode ? "text-light" : "text-dark"}`}>{user.displayName || user.email.split("@")[0]}</h5>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => setShowCustomizationModal(true)}
                title="تنظیمات"
              >
                <i className="bi bi-gear-fill"></i>
              </button>
              <button
                className={`btn btn-outline-danger btn-sm ${authLoading ? "disabled" : ""}`}
                onClick={confirmLogout}
                disabled={authLoading}
                title="خروج"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>

            <div className="p-3 border-bottom">
              <input
                type="text"
                className="form-control"
                placeholder="جستجوی کاربران..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ul className="list-group list-group-flush flex-grow-1 overflow-auto">
              <li
                className={`list-group-item user-list-item ${selectedChat?.isSelfChat ? "active" : ""} ${
                  unreadMessages[user.uid] > 0 ? "new-message-highlight" : ""
                }`}
                onClick={() => handleSelectChat(user)}
              >
                <div className="d-flex align-items-center">
                  <img src={user.photoURL || generateAvatarUrl(user.email)} alt="خودم" className="profile-avatar-sm me-3" />
                  <div className="flex-grow-1">
                    <h6 className="mb-0">پیام‌های ذخیره‌شده</h6>
                    <small className="text-muted">یادداشت‌های شخصی</small>
                  </div>
                  {unreadMessages[user.uid] > 0 && <span className="unread-badge">{unreadMessages[user.uid]}</span>}
                </div>
              </li>
              {filteredUsers.map((targetUser) => {
                const chatId = [user.uid, targetUser.uid].sort().join("_");
                return (
                  <li
                    key={targetUser.id}
                    className={`list-group-item user-list-item ${
                      selectedChat?.targetUser?.id === targetUser.id && !selectedChat?.isSelfChat ? "active" : ""
                    } ${unreadMessages[chatId] > 0 ? "new-message-highlight" : ""}`}
                    onClick={() => handleSelectChat(targetUser)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={targetUser.profilePicture || generateAvatarUrl(targetUser.email)}
                        alt={targetUser.displayName || targetUser.email.split("@")[0]}
                        className="profile-avatar-sm me-3"
                        onClick={() => setFullscreenImage(targetUser.profilePicture || generateAvatarUrl(targetUser.email))}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{targetUser.displayName || targetUser.email.split("@")[0]}</h6>
                        <small className="text-muted">آخرین بازدید: اخیراً</small>
                      </div>
                      {unreadMessages[chatId] > 0 && <span className="unread-badge">{unreadMessages[chatId]}</span>}
                      <span className="online-dot"></span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-md-9 d-flex flex-column" ref={chatContainerRef}>
            {!selectedChat ? (
              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <h2 className="text-muted">لطفاً یک چت را انتخاب کنید</h2>
              </div>
            ) : (
              <>
                <div className="p-3 border-bottom d-flex align-items-center" ref={chatDisplayRef}>
                  <img
                    src={
                      selectedChat.isSelfChat
                        ? user.photoURL || generateAvatarUrl(user.email)
                        : selectedChat.targetUser?.profilePicture || generateAvatarUrl(selectedChat.targetUser?.email)
                    }
                    alt="پروفایل"
                    className="profile-avatar-sm me-3"
                    onClick={() =>
                      setFullscreenImage(
                        selectedChat.isSelfChat
                          ? user.photoURL || generateAvatarUrl(user.email)
                          : selectedChat.targetUser?.profilePicture || generateAvatarUrl(selectedChat.targetUser?.email)
                      )
                    }
                  />
                  <h5 className="mb-0">
                    {selectedChat.isSelfChat
                      ? "پیام‌های ذخیره‌شده"
                      : selectedChat.targetUser?.displayName || selectedChat.targetUser?.email.split("@")[0]}
                  </h5>
                </div>

                <div className="bubble-container flex-grow-1">
                  {isTyping && !selectedChat.isSelfChat && (
                    <div className="typing-indicator">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`d-flex align-items-end ${message.senderId === user.uid ? "justify-content-end" : "justify-content-start"}`}
                    >
                      {message.senderId !== user.uid && (
                        <img
                          src={message.senderPhotoURL || generateAvatarUrl(message.senderName)}
                          alt="فرستنده"
                          className="profile-avatar-sm me-2"
                          onClick={() => setFullscreenImage(message.senderPhotoURL || generateAvatarUrl(message.senderName))}
                        />
                      )}
                      <div className="message-bubble">
                        <p className="mb-1">{message.text}</p>
                        {linkPreviews[message.id] &&
                          Object.values(linkPreviews[message.id]).map((preview, index) => (
                            <div key={index} className="link-preview">
                              {preview.image && <img src={preview.image} alt="پیش‌نمایش" />}
                              <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                <h6>{preview.title}</h6>
                              </a>
                              <p className="text-muted">{preview.description}</p>
                            </div>
                          ))}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="message-timestamp">
                            {message.timestamp?.toDate().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                            {message.edited && <span className="ms-2 text-muted">(ویرایش‌شده)</span>}
                            {message.senderId === user.uid && (
                              <span className="ms-2">
                                {message.readBy?.length > 1 ? (
                                  <i className="bi bi-check2-all" style={{ color: "#4c9be8" }}></i>
                                ) : (
                                  <i className="bi bi-check2"></i>
                                )}
                              </span>
                            )}
                          </div>
                          {message.senderId === user.uid && (
                            <div className="message-actions d-flex gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleEditMessage(message)}
                                title="ویرایش"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => confirmDeleteMessage(message.id)}
                                title="حذف"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  {editingMessage && (
                    <div className="alert alert-light py-1 px-3 me-2 mb-0 d-flex align-items-center" style={{ borderRadius: "15px" }}>
                      <small className="text-muted me-2">در حال ویرایش:</small>
                      <strong className="text-truncate" style={{ maxWidth: "150px" }}>{editingMessage.text}</strong>
                      <button className="btn btn-sm btn-outline-dark ms-2" onClick={cancelEdit}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  )}
                  <div className="emoji-picker-container me-2">
                    <button
                      className="emoji-toggle-button"
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      title="استیکر‌ها"
                    >
                      <i className="bi bi-emoji-smile"></i>
                    </button>
                    <div ref={emojiPickerRef} className={["emoji-picker-popup", showEmojiPicker ? "show" : ""].join(" ")}>
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme={darkMode ? "dark" : "light"} />
                    </div>
                  </div>
                  <textarea
                    className="form-control me-2"
                    rows="2"
                    placeholder={editingMessage ? "پیام ویرایش‌شده..." : "پیام خود را بنویسید..."}
                    value={editingMessage ? editedMessageText : newMessage}
                    onChange={(e) => {
                      if (editingMessage) {
                        setEditedMessageText(e.target.value);
                      } else {
                        setNewMessage(e.target.value);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    style={{ resize: "none", maxHeight: "100px" }}
                  ></textarea>
                  <button
                    className={`btn btn-primary ${sendingMessage ? "disabled" : ""}`}
                    onClick={editingMessage ? saveEditedMessage : sendMessage}
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : editingMessage ? (
                      <i className="bi bi-check-circle"></i>
                    ) : (
                      <i className="bi bi-send-fill"></i>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {showProfileModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">ویرایش پروفایل</h5>
                    <button className="btn-close" onClick={() => setShowProfileModal(false)}></button>
                  </div>
                  <div className="modal-body text-center">
                    <img
                      src={profileImagePreview}
                      alt="تصویر پروفایل"
                      className="profile-avatar-lg"
                      onClick={() => setFullscreenImage(profileImagePreview)}
                    />
                    <div className="mb-3">
                      <label htmlFor="profileImageUrl" className="form-label">لینک تصویر پروفایل</label>
                      <input
                        type="url"
                        id="profileImageUrl"
                        className="form-control"
                        placeholder="لینک تصویر (حداکثر 2048 کاراکتر)"
                        value={profileImageUrl}
                        onChange={handleProfileImageUrlChange}
                      />
                      {profileImageUrl && (
                        <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleClearProfileImage}>
                          حذف تصویر
                        </button>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="displayName" className="form-label">نام نمایشی</label>
                      <input
                        type="text"
                        id="displayName"
                        className="form-control"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder="نام نمایشی خود را وارد کنید"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={() => setShowProfileModal(false)}>
                      لغو
                    </button>
                    <button className="btn btn-primary" onClick={handleUpdateProfile} disabled={updatingProfile}>
                      {updatingProfile ? "در حال ثبت..." : "ذخیره"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCustomizationModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">تنظیمات چت</h5>
                    <button className="btn-close" onClick={() => setShowCustomizationModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">انتخاب تم</label>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-outline-primary ${userCustomizations.theme === "telegram" ? "active" : ""}`}
                          onClick={() => handleThemeChange("telegram")}
                        >
                          تلگرام
                        </button>
                        <button
                          className={`btn btn-outline-success ${userCustomizations.theme === "whatsapp" ? "active" : ""}`}
                          onClick={() => handleThemeChange("whatsapp")}
                        >
                          واتساپ
                        </button>
                        <button
                          className={`btn btn-outline-info ${userCustomizations.theme === "imessage" ? "active" : ""}`}
                          onClick={() => handleThemeChange("imessage")}
                        >
                          iMessage
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bubbleColor" className="form-label">رنگ حباب پیام</label>
                      <input
                        type="color"
                        id="bubbleColor"
                        className="form-control form-control-color"
                        value={chatBubbleColor}
                        onChange={(e) => setChatBubbleColor(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="backgroundColor" className="form-label">رنگ پس‌زمینه</label>
                      <input
                        type="color"
                        id="backgroundColor"
                        className="form-control form-control-color"
                        value={chatBackgroundColor}
                        onChange={(e) => setChatBackgroundColor(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="chatBackgroundImageUrl" className="form-label">لینک تصویر پس‌زمینه</label>
                      {chatBackgroundImagePreview && (
                        <div className="mb-2">
                          <img
                            src={chatBackgroundImagePreview}
                            alt="پیش‌نمایش"
                            className="img-thumbnail rounded"
                            style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "cover" }}
                            onClick={() => setFullscreenImage(chatBackgroundImagePreview)}
                          />
                          <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleClearChatBackgroundImage}>
                            حذف تصویر
                          </button>
                        </div>
                      )}
                      <input
                        type="url"
                        id="chatBackgroundImageUrl"
                        className="form-control"
                        placeholder="URL تصویر پس‌زمینه"
                        value={chatBackgroundImageUrl}
                        onChange={handleChatBackgroundImageUrlChange}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={() => setShowCustomizationModal(false)}>
                      لغو
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveCustomization} disabled={savingCustomization}>
                      {savingCustomization ? "در حال ثبت..." : "ذخیره"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showConfirmModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {modalAction === "logout" ? "تأیید خروج" : modalAction === "deleteMessage" ? "تأیید حذف" : ""}
                    </h5>
                    <button className="btn-close" onClick={handleModalCancel}></button>
                  </div>
                  <div className="modal-body text-center">
                    <p>
                      {modalAction === "logout"
                        ? "آیا می‌خواهید از حساب کاربری خود خارج شوید؟"
                        : "آیا می‌خواهید این پیام را برای همیشه حذف کنید؟"}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={handleModalCancel}>
                      خیر
                    </button>
                    <button className={`btn btn-${modalAction === "logout" ? "danger" : "primary"}`} onClick={handleModalConfirm}>
                      بله
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;