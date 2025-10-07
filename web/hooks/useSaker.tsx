import { api, type Sak, type SakAction } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const sakerKeys = {
  all: ["saker"] as const,
  lists: () => [...sakerKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...sakerKeys.lists(), { filters }] as const,
  details: () => [...sakerKeys.all, "detail"] as const,
  detail: (id: string) => [...sakerKeys.details(), id] as const,
};

// Hook to fetch all saker
export function useSaker() {
  return useQuery({
    queryKey: sakerKeys.lists(),
    queryFn: api.getSaker,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to fetch single sak
export function useSak(id: string) {
  return useQuery({
    queryKey: sakerKeys.detail(id),
    queryFn: () => api.getSakById(id),
    enabled: !!id,
  });
}

// Hook to create new sak
export function useCreateSak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createSak,
    onSuccess: (newSak) => {
      // Invalidate and refetch saker list
      queryClient.invalidateQueries({ queryKey: sakerKeys.lists() });

      // Optionally add the new sak to the cache
      queryClient.setQueryData(sakerKeys.detail(newSak.id), newSak);
    },
    onError: (error) => {
      console.error("Failed to create sak:", error);
    },
  });
}

// Hook to perform actions on sak
export function useSakAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, sakId }: { action: SakAction; sakId: string }) =>
      api.performSakAction(action, sakId),
    onSuccess: (_, { sakId }) => {
      // Invalidate saker list to refresh all data
      queryClient.invalidateQueries({ queryKey: sakerKeys.lists() });

      // Invalidate specific sak detail if it exists
      queryClient.invalidateQueries({ queryKey: sakerKeys.detail(sakId) });
    },
    onError: (error, { action }) => {
      console.error(`Failed to ${action}:`, error);
    },
  });
}

// Hook for optimistic updates (advanced)
export function useSakActionOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, sakId }: { action: SakAction; sakId: string }) =>
      api.performSakAction(action, sakId),
    onMutate: async ({ action, sakId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: sakerKeys.lists() });

      // Snapshot the previous value
      const previousSaker = queryClient.getQueryData<Sak[]>(sakerKeys.lists());

      // Optimistically update the sak status
      if (previousSaker) {
        const newStatus = getNextStatus(action);
        const updatedSaker = previousSaker.map((sak) =>
          sak.id === sakId
            ? { ...sak, status: newStatus, lastUpdated: new Date().toISOString() }
            : sak,
        );
        queryClient.setQueryData(sakerKeys.lists(), updatedSaker);
      }

      return { previousSaker };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousSaker) {
        queryClient.setQueryData(sakerKeys.lists(), context.previousSaker);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: sakerKeys.lists() });
    },
  });
}

// Helper function to determine next status
function getNextStatus(action: SakAction): Sak["status"] {
  switch (action) {
    case "start-sak":
      return "InProgress";
    case "end-sak":
      return "Done";
    case "archive-sak":
      return "Archived";
    default:
      return "Created";
  }
}
