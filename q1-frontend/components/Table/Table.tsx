/* eslint-disable react/jsx-key */

import { useState } from "react";
import AlertModal from "../AlertModal";
import styles from "./Table.module.css";

// !!!!!!!!!!!!!!!!!!!!
// TODO is at line 68 !
// !!!!!!!!!!!!!!!!!!!!

interface AlertUpdate {
  date: string;
  update: string;
}

interface Alert {
  alert: string;
  status: string;
  updates: AlertUpdate[];
}

export interface TableContents {
  columnTitles: string[];
  rowContents: Alert[];
}

export default function Table() {
  const [contents, useContents] = useState<TableContents>({
    columnTitles: ["Alert", "Status", "Updates"],
    rowContents: [
      {
        alert: "food",
        status: "good!",
        updates: [],
      },
      {
        alert: "water",
        status: "low",
        updates: [
          { update: "dropped to 10% below normal", date: "11/11/2022" },
        ],
      },
      {
        alert: "shelter",
        status: "terrible :(",
        updates: [
          { update: "slept on cold ground", date: "11/11/2022" },
          { update: "slept on hard concrete", date: "13/11/2022" },
        ],
      },
      {
        alert: "Done!",
        status: "Expressionless-Ball-Thing",
        updates: [],
      },
    ],
  });

  /**
   * Makes a temp content, add in the new item, then update the state.
   */
  const addNewAlert = (alert: string) => {
    let newContent = { ...contents };
    newContent.rowContents.push({ alert: alert, status: "", updates: [] });
    useContents(newContent);
  };

  return (
    <>
      {/* instead of passing in useContents, pass in the function creates the new alert and updates the state*/}
      <AlertModal addNewAlert={addNewAlert} />
      <div className={styles.myTable}>
        <div className={styles.row}>
          {contents.columnTitles.map((item) => (
            <div className={styles.item} key={item}>
              {item}
            </div>
          ))}
        </div>
        {contents.rowContents.map((content) => (
          <div data-testid="row" className={styles.row}>
            <div className={styles.item}>{content.alert}</div>
            <div className={styles.item}>{content.status}</div>
            <div className={styles.item}>
              {/* TODO: add updates */}
              {/*
                each update can be split into the update text and the date.
                the update text and the date or on opposite ends of the div, so I took advantage
                of flexbox and space-between.

                The date ahs the additional property of having a smaller font, in blue and is positioned near the
                bottom of its div, so I placed it in another flexbox, and apply the styles there.
              */}
              {content.updates.map((update) => {
                return (
                  <div className={styles.update}>
                    <span>{update.update}</span>
                    <span className={styles.date}>{update.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
