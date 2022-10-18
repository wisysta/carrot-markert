import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoord";

interface WriteForm {
    question: string;
}

const Write: NextPage = () => {
    const { latitude, longitude } = useCoords();
    const router = useRouter();
    const { register, handleSubmit } = useForm<WriteForm>();
    const [post, { loading, data }] = useMutation("/api/posts");
    const onValid = (form: WriteForm) => {
        if (loading) return;
        if (latitude && longitude) {
            post({ ...form, latitude, longitude });
        }
    };

    useEffect(() => {
        if (data && data.ok) {
            router.push(`/community/${data.post.id}`);
        }
    }, [data, router]);
    return (
        <Layout canGoBack title="Write Post">
            <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
                <TextArea
                    register={register("question", {
                        required: true,
                        minLength: 5,
                    })}
                    required
                    placeholder="Ask a question!"
                />
                <Button loading={loading} text="Submit" />
            </form>
        </Layout>
    );
};

export default Write;
