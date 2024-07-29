import AddDocumentBtn from "@/components/AddDocumentBtn";
import { DeleteModal } from "@/components/DeleteModal";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Notifications from "@/components/Notifications";
import { Button } from "@/components/ui/button";
import { getDocuments } from "@/lib/actions/room.action";
import { getClerkUsers } from "@/lib/actions/user.action";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const roomDocument = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 right-0">
        <div className="flex items-end gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {roomDocument.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>

          <ul className="document-ul">
            {roomDocument.data.map(async (user: any) => {
              const { id, metadata, createdAt, usersAccesses } = user;

              const usersEmails: string[] = Object.keys(usersAccesses);
              const collaborators = await getClerkUsers({
                userIds: usersEmails,
              });

              const currentUserIndex = collaborators.findIndex(
                (collaborator: any) =>
                  collaborator.email ===
                  clerkUser.emailAddresses[0].emailAddress
              );

              if (currentUserIndex !== -1) {
                const [currentUser] = collaborators.splice(currentUserIndex, 1);
                collaborators.push(currentUser);
              }

              // console.log("currentUserIndex: ", currentUserIndex);

              const currentUserType = usersAccesses[
                clerkUser.emailAddresses[0].emailAddress
              ]?.includes("room:write")
                ? "editor"
                : "viewer";

              return (
                <li key={id} className="document-list-item">
                  <Link
                    href={`/documents/${id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100">
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>

                  <ul className="collaborators-list">
                    {collaborators
                      .slice(0, 5)
                      .map(({ avatar, name }: any, index: number) => (
                        <li key={index} className="">
                          <Image
                            src={avatar}
                            alt={name}
                            width={100}
                            height={100}
                            className="inline-block size-8 rounded-full ring ring-dark-100"
                          />
                        </li>
                      ))}
                  </ul>

                  {currentUserType === "editor" && <DeleteModal roomId={id} />}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
