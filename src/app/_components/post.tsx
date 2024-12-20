"use client";

import { useRef, type FormEvent } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const formRef = useRef<HTMLFormElement>(null);
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      formRef.current?.reset();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    createPost.mutate({ name });
  };

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          name="name"
          placeholder="Title"
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
