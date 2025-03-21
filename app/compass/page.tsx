'use client'
import * as React from "react";
import { useOrientation } from "@uidotdev/usehooks";

export default function App() {
  const orientation = useOrientation();

  return (
    <section>
      <h1>useOrientation</h1>

      <article
        style={{ "--angle": `${orientation.angle}deg` } as React.CSSProperties}
        className={orientation.type.toLocaleLowerCase()}
      />
      <table>
        <tbody>
          {Object.keys(orientation).map((key) => {
            return (
              <tr key={key}>
                <th>{key}</th>
                <td>{orientation[key as keyof typeof orientation]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}