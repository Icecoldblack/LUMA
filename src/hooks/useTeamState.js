import { useState } from "react";
import { initialTeammates } from "../state/teammates";

export function useTeamState() {
  const [teammates, setTeammates] = useState(initialTeammates);

  function updateTeammateAnalysis(id, { transcript, mood, blockers, summary }) {
    setTeammates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, transcript, mood, blockers, summary } : t
      )
    );
  }

  function resetTeammate(id) {
    setTeammates((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, transcript: null, mood: null, blockers: null, summary: null }
          : t
      )
    );
  }

  return { teammates, updateTeammateAnalysis, resetTeammate };
}
