import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

type Video = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
  length?: string;
};

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const navigate = useNavigate();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    // fetched.current = true;

    const fetchVideo = async () => {
      const { data } = await api.get(`/video?id=${id}`);
      data.uploadDate = new Date(data.uploadDate);
      setVideo(data);
    };

    fetchVideo().catch((err) => {
      console.error(err);
      navigate("/login");
    });
  }, [id]);

  return video;
}

export function useVideos(endpoint: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();
  const fetched = useRef(false);

  const fetchDatas = async () => {
    const { data } = await api.get(endpoint);

    if (data) {
      setVideos(
        data.map((video: any) => {
          if (video.length) {
            const duration = video.length as number;
            if (duration >= 60) {
              const min = Math.round(duration / 60);
              if (min >= 60) {
                const hour = Math.round(min / 60);
                video.length = `${hour} h`;
              } else {
                video.length = `${min} min`;
              }
            } else {
              video.length = `${duration} sec`;
            }
          }

          return {
            ...video,
            uploadDate: new Date(video.uploadDate),
          };
        })
      );
    }
  };

  const fetchVideos = () => {
    fetchDatas().catch((err) => {
      console.error(err);
      navigate("/login");
    });
  };

  useEffect(() => {
    if (endpoint && !fetched.current) {
      fetchVideos();
      // fetched.current = true;
    }
  }, [endpoint]);

  return { videos, fetchVideos };
}

type User = {
  email: string;
  fullname: string;
  avatar: string | null;
};

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    api
      .get(`/user/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return user;
}
