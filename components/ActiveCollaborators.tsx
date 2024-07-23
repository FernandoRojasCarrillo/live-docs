"use client";

import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const ActiveCollaborators = () => {
  const others = useOthers();
  const collaborators = others.map((other) => other.info);

  const { user } = useUser();

  return (
    <ul className="collaborators-list">
      {collaborators.map(
        ({ id, avatar, name, color }) =>
          user?.id !== id && (
            <li key={id} className="">
              <Image
                src={avatar}
                alt={name}
                width={100}
                height={100}
                className="inline-block size-8 rounded-full ring-2 ring-dark-100"
                style={{ border: `3px solid ${color}` }}
              />
            </li>
          )
      )}
    </ul>
  );
};

export default ActiveCollaborators;
