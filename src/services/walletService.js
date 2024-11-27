import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';

// Initialize the wallets node in RTDB if it doesn't exist
const initializeDatabase = async () => {
  try {
    const rtdb = getDatabase();
    const walletsRef = ref(rtdb, 'wallets');
    
    // Check if wallets node exists
    const snapshot = await get(walletsRef);
    if (!snapshot.exists()) {
      // Initialize the wallets node with an empty object
      await set(walletsRef, {
        initialized: new Date().toISOString()
      });
      console.log('Initialized wallets node in RTDB');
    }
  } catch (error) {
    if (error.code === 'PERMISSION_DENIED') {
      console.error('Permission denied. Please check Firebase rules.');
    } else {
      console.error('Error initializing database:', error);
    }
  }
};

export const saveWalletAddress = async (publicKey) => {
  try {
    console.log('Starting wallet save process for:', publicKey);
    
    // Try to initialize first
    await initializeDatabase().catch(console.error);
    
    let firestoreSuccess = false;
    let firestoreDocId = null;
    
    // Try Firestore first
    try {
      const walletsRef = collection(db, 'wallets');
      const q = query(walletsRef, where('publicKey', '==', publicKey));
      const querySnapshot = await getDocs(q);
      const timestamp = new Date().toISOString();

      if (querySnapshot.empty) {
        const newWallet = {
          publicKey,
          timestamp,
          lastSeen: timestamp,
          visits: 1
        };
        const docRef = await addDoc(walletsRef, newWallet);
        firestoreDocId = docRef.id;
        console.log('Wallet saved to Firestore with ID:', docRef.id);
      } else {
        const docRef = doc(db, 'wallets', querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          lastSeen: timestamp,
          visits: (querySnapshot.docs[0].data().visits || 0) + 1
        });
        firestoreDocId = querySnapshot.docs[0].id;
        console.log('Wallet updated in Firestore');
      }
      firestoreSuccess = true;
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      if (firestoreError.code === 'permission-denied') {
        console.error('Please check Firestore rules in Firebase Console');
      }
    }

    // Try Realtime Database
    try {
      const rtdb = getDatabase();
      const sanitizedKey = publicKey.replace(/[.#$/\[\]]/g, '_');
      const walletRef = ref(rtdb, 'wallets/' + sanitizedKey);
      const timestamp = new Date().toISOString();
      
      const rtdbData = {
        publicKey,
        timestamp,
        lastSeen: timestamp,
        firestoreDocId,
        online: true,
        firestoreSync: firestoreSuccess
      };
      
      await set(walletRef, rtdbData);
      console.log('Successfully saved to RTDB');

      // Set up disconnect handler
      const onlineRef = ref(rtdb, '.info/connected');
      onValue(onlineRef, (snapshot) => {
        if (snapshot.val() === false) return;
        
        const userStatusRef = ref(rtdb, 'wallets/' + sanitizedKey);
        set(userStatusRef, {
          ...rtdbData,
          online: false,
          lastDisconnect: new Date().toISOString()
        });
      });
    } catch (rtdbError) {
      console.error('RTDB error:', rtdbError);
      if (rtdbError.code === 'PERMISSION_DENIED') {
        console.error('Please check Realtime Database rules in Firebase Console');
      }
      throw rtdbError;
    }

    return firestoreSuccess;
  } catch (error) {
    console.error('Error in saveWalletAddress:', error);
    throw error;
  }
}; 