import { useToast } from "@/hooks/use-toast";

const useFormToast = () => {
  const { toast } = useToast();

  const destructiveToast = (msg) => {
    toast({
      variant: "destructive",
      title: msg,
    });
  };

  const primaryToast = ({
    boldText,
    boldClassName,
    description,
    descriptionClassName,
    icon = null,
  }) => {
    toast({
      variant: "success",
      title: "Success",
      description,
      boldText,
      boldClassName,
      descriptionClassName,
      icon,
    });
  };

  return {
    destructiveToast,
    primaryToast,
  };
};

export default useFormToast;
