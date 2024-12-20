import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/types/Post";


export function useUpdatePostMutation(){
    const { toast } = useToast();
    const queryClient = useQueryClient();
   
    const mutation = useMutation({
        mutationFn: async ({
            content,
            imageUrl,
            postId
        }:{
            content: string | null,
            imageUrl: string | null
            postId: string
        }) =>{
            return updatePost(content, imageUrl, postId);
        },
        onSuccess:async (data) =>{
             // Recuperamos la respuesta de la API
      const { ok, updatedPost, SuccessMessage, error } = data;
      
      
      if (!ok) {
        
        toast({
          variant: "destructive",
          description: error || "Failed to update profile. Please try again.",
        });
        return;
      }

      // Actualizamos los datos de los posts en el cache de React Query
      const queryFilter: QueryFilters = {
        queryKey: ["posts"],
      };

      await queryClient.cancelQueries(queryFilter);

        queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return undefined;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) =>{
                if(post.id === updatedPost?.id){
                  return {
                    ...post,
                    content: updatedPost?.content,
                    image: updatedPost?.image,
                  }
                }
                return post;
              }
                
              ),
            })),
          };
        }
    )
    // Mostramos una notificación de éxito
    toast({
      title: "Post updated",
      description: SuccessMessage || "Post updated successfully.",
      variant: "success",
    });

},
        onError: async (error) =>{
            console.error(error);
            console.log(error.message as string);
            toast({
              variant: "destructive",
              description: "Failed to update profile. Please try again." + error.message as string,
            });
        }
    })

    return mutation;
}