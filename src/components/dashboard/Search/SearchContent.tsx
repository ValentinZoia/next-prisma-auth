"use client";
import { getAllUsersByUsername } from "@/data/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import UserHeaderPost from "../Post/UserHeaderPost";
import Link from "next/link";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import { Loader, LoaderCircle } from "lucide-react";
import { UserData } from "@/types/Post";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  if (!query) {
    return <p>No se encontraron resultados</p>;
  }

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", query], //<-- La key de la información
    queryFn: ({
      pageParam,
    }: {
      pageParam?: string | number | null | undefined;
      username?: string | null | undefined;
    }) => getAllUsersByUsername({ pageParam, username: query }), //<-- Cómo traer la información
    enabled: !!query.trim(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // Define el siguiente parámetro de paginación
  });

  if (isLoading) {
    return (
      <div className="w-full py-4 flex justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  const users = data.pages.flatMap((page) => page.users);

  //Memorizar los datos de los usuarios para evitar recalculaciones innecesarias.
  const userData: UserData[] = useMemo(() => users, [users]);
  
  //Memorizar la función handleBottomReached para evitar su recreación en cada renderizado.
  const handleBottomReached = useCallback(() => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, fetchNextPage]);


  return (
    <InfiniteScrollContainer
      className="relative z-10 space-1-2"
      onBottomReached={handleBottomReached}
    >
      <div className="w-full bg-card border-x-[1px] border-b-[1px]   h-auto flex flex-col items-stretch">
        {userData.map((user) => (
          <div key={user.id}>
            <Link href={`${baseUrl}/dashboard/users/${user.name}`}>
              <div
                key={user.id}
                className="w-full h-1/2 p-4 hover:bg-secondary border-t-[1px] "
              >
                <UserHeaderPost
                  username={user.name}
                  avatarUrl={user.image}
                  linkTo={`${baseUrl}/dashboard/users/${user.name}`}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      {isFetchingNextPage && <Loader className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
