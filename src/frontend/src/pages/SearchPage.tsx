import UserCard from "@/components/ui/UserCard";
import { useSearchUsers } from "@/hooks/useQueries";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: users, isLoading } = useSearchUsers(query);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Search size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Search</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Find people and content on SocializeX
        </p>
      </motion.div>

      {/* Search input */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-2xl border border-border/40 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-neon"
          data-ocid="search.search_input"
        />
        {isLoading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        )}
      </div>

      <AnimatePresence mode="wait">
        {query.trim() === "" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="search.empty_state"
          >
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-semibold text-foreground mb-2">
              Start searching
            </h3>
            <p className="text-sm text-muted-foreground">
              Type a name or username to find people.
            </p>
          </motion.div>
        )}

        {query.trim() !== "" &&
          !isLoading &&
          (!users || users.length === 0) && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-12 text-center"
              data-ocid="search.no_results_state"
            >
              <p className="text-4xl mb-3">😶</p>
              <h3 className="font-semibold text-foreground mb-2">
                No results for "{query}"
              </h3>
              <p className="text-sm text-muted-foreground">
                Try a different name or username.
              </p>
            </motion.div>
          )}

        {users && users.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
            data-ocid="search.results_list"
          >
            {users.map((user, i) => (
              <UserCard key={user.id.toString()} user={user} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
