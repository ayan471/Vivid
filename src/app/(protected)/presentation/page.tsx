import { redirect } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  redirect("/dashboard");
};

export default Page;
