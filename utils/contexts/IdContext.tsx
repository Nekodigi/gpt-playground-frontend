import { auth } from "@/lib/firebase/firebase";
import axios from "axios";
import { User } from "firebase/auth";
import { useParams, useSearchParams } from "next/navigation";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type IdContextProps = {
  userId: string;
  browserId: string;
  loading: boolean;
};
const IdContext = createContext({} as IdContextProps);

export function useIdContext() {
  return useContext(IdContext);
}

export function IdProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const { service_id } = useParams();
  const [browserId, setBrowserId] = useState("");
  const [userId, setUserId] = useState("");
  const [redirectId, setRedirectId] = useState("");

  const value = {
    userId,
    browserId,
    loading,
  };

  useEffect(() => {
    const f = async () => {
      let browserId_ = localStorage.getItem("browserId");
      let id;
      if (!browserId_) {
        let res = await axios({
          method: "get",
          url: `${process.env.NEXT_PUBLIC_CHARGE_BACK_URL}/user/unique_id`,
        });
        id = res.data.id;

        localStorage.setItem("browserId", id);
      } else {
        id = browserId_;
      }
      let redirectRes = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_CHARGE_BACK_URL}/redirect/${process.env.NEXT_PUBLIC_SERVICE_ID}/${id}`,
      });
      let redirectedUser = redirectRes.data.id;
      setRedirectId(redirectedUser);
      setUserId(redirectedUser ? redirectedUser : id);
      setBrowserId(id);
      setLoading(false);
      console.log(browserId_, redirectedUser ? redirectedUser : id);
    };
    f();
  }, []);

  return (
    <IdContext.Provider value={value}>
      {!loading && children}
    </IdContext.Provider>
  );
}
