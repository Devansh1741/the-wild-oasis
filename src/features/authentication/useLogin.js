import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as LoginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => LoginApi({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard", { replace: true });
    },

    onError: (err) => {
      console.error("Error", err);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isLoading };
}
