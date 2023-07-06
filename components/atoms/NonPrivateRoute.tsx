import { useAuthContext } from "@/utils/contexts/IdContext";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { Layout } from "../organisms/Layout";
import axios from "axios";

export const NonPrivateRoute = ({
  children,
  action,
  plan,
  ...rest
}: {
  children: ReactNode;
  action?: string;
  plan?: string;
}) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const { service_id } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      const onUser = async () => {
        if (!action) {
          router.push(`/${service_id}`);
        } else {
          let res = await axios({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${service_id}/${user?.uid}`,
            method: "get",
            data: {},
          });
          let data = res.data;
          if (data.plan === "free") {
            router.push(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscription/url/${service_id}/${user?.uid}/${plan}?success_url=${window.location.origin}/${service_id}&cancel_url=${window.location.origin}/${service_id}`
            );
          } else {
            router.push(`/${service_id}`);
          }
        }
      };
      onUser();
    }
  }, [user]);

  return !user ? children : <Layout>Loading</Layout>;
};
