import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getDocuments } from "@/lib/actions/room.action";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
  const cleckUser = await currentUser();
  if (!cleckUser) redirect("/sign-in");

  const roomDocument = await getDocuments(
    cleckUser.emailAddresses[0].emailAddress
  );

  return (
    <main className="home-container">
      <Header className="sticky left-0 right-0">
        <div className="flex items-end gap-2 lg:gap-4">
          Notification
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
              userId={cleckUser.id}
              email={cleckUser.emailAddresses[0].emailAddress}
            />
          </div>

          <ul className="document-ul">
            {roomDocument.data.map(({ id, metadata, createdAt }: any) => (
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

                {/* TODO: Delete Button  */}
              </li>
            ))}
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
            userId={cleckUser.id}
            email={cleckUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;