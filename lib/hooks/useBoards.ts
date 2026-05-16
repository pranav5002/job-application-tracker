"use client";

import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { deleteJobApplication, updateJobApplication, deleteColumn } from "../actions/job-applications";

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  const [prevBoardId, setPrevBoardId] = useState(initialBoard?._id);
  if (initialBoard?._id !== prevBoardId) {
    setBoard(initialBoard || null);
    setColumns(initialBoard?.columns || []);
    setPrevBoardId(initialBoard?._id);
  }

  async function moveJob(
    jobApplicationId: string,
    newColumnId: string,
    newOrder: number
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const col of newColumns) {
        const jobIndex = col.jobApplications.findIndex(
          (j) => j._id === jobApplicationId
        );
        if (jobIndex !== -1 && jobIndex !== undefined) {
          jobToMove = col.jobApplications[jobIndex];
          oldColumnId = col._id;
          col.jobApplications = col.jobApplications.filter(
            (job) => job._id !== jobApplicationId
          );
          break;
        }
      }

      if (jobToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col._id === newColumnId
        );
        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentJobs = targetColumn.jobApplications || [];

          const updatedJobs = [...currentJobs];
          updatedJobs.splice(newOrder, 0, {
            ...jobToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const jobsWithUpdatedOrders = updatedJobs.map((job, idx) => ({
            ...job,
            order: idx * 100,
          }));

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            jobApplications: jobsWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      await updateJobApplication(jobApplicationId, {
        columnId: newColumnId,
        order: newOrder,
      });
    } catch (err) {
      console.error("Error", err);
    }
  }

  async function removeJob(jobApplicationId: string, columnId: string) {
    const previousColumns = JSON.parse(JSON.stringify(columns));

    setColumns((prev) =>
      prev.map((col) => {
        if (col._id === columnId) {
          return {
            ...col,
            jobApplications: col.jobApplications.filter(
              (job) => job._id !== jobApplicationId
            ),
          };
        }
        return col;
      })
    );

    try {
      const result = await deleteJobApplication(jobApplicationId, columnId);
      if (result && "error" in result) {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Failed to delete job application:", err);
      setError("Failed to delete application. Rolling back changes.");
      setColumns(previousColumns);
    }
  }

  // NEW COLUMN REMOVAL FUNCTIONALITY
  async function removeColumn(columnId: string, boardId: string) {
    const previousColumns = [...columns];

    // Optimistic UI update: Instantly drop the column component from layout mapping
    setColumns((prev) => prev.filter((col) => col._id !== columnId));

    try {
      const result = await deleteColumn(columnId, boardId);
      if (result && "error" in result) {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Failed to delete column:", err);
      setError("Failed to delete column. Rolling back layout changes.");
      setColumns(previousColumns); // Restores column grid layout structure if backend errors out
    }
  }

  return { board, columns, error, moveJob, removeJob, removeColumn };
}