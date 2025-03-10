import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "./firebase";
import ProfileIcon from "../components/profileIcon";
import {
  collection,
  where,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { ITWeet } from "../components/timeline";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Tweet = styled.div``;

export default function Profile() {
  const user = auth.currentUser;
  const [tweets, setTweets] = useState<ITWeet[]>([]);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    if (user) {
      fetchTweets();
      console.log(tweets);
    }
  }, [user]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <ProfileIcon />}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
      {tweets.map((tweet) => (
        <Tweets key={tweet.id}>
          <p>
            <strong>{tweet.username}</strong>
          </p>
          <p>{tweet.tweet}</p>
        </Tweets>
      ))}
    </Wrapper>
  );
}
