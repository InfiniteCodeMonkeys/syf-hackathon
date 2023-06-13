/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const Home: NextPage = () => {
  const results = trpc.openAI.getResults.useMutation();
  const [show, setShow] = useState("Mad Men from AMC");
  const [thing, setThing] = useState("furniture and decorations");
  const [loading, setLoading] = useState(false);
  const [openAIResponse, setOpenAIResponse] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    const response = (await results.mutateAsync({ show, thing })) as any;
    console.log(response);
    setOpenAIResponse(response);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>SYF Hackathon</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          SYF <span className="text-purple-300">Hack</span>athon
        </h1>
        <div className="mt-2 w-[78%]">
          <div className="flex flex-col justify-center">
            <span className="text-lg text-gray-900 text-center">
              Hi Jane, try shopping for{" "}
              <select
                name="thing"
                className="mt-1 mr-2 w-58 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={thing}
                onChange={(e) => setThing(e.currentTarget.value)}
              >
                <option value="furniture and decorations">
                  furniture and decorations
                </option>
                <option value="clothes">clothes</option>
                <option value="jewelry">jewelry</option>
              </select>{" "}
              based on{" "}
              <select
                name="thing"
                className="mt-1 mr-2 w-58 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={show}
                onChange={(e) => setShow(e.currentTarget.value)}
              >
                <option value="Mad Men from AMC">Mad Men</option>
                <option value="Star Wars">Star Wars</option>
                <option value="Downton Abbey">Downton Abbey</option>
                <option value="Mamma Mia!">Mamma Mia!</option>
                <option value="Legally Blonde">Legally Blonde</option>

                <option value="Stranger Things">Stranger Things</option>

                <option value="Grand Budapest Hotel">Wes Anderson</option>

                <option value="Super Mario Brothers">
                  Super Mario Brothers
                </option>

                <option value="The Kardashians">The Kardashians</option>

                <option value="Game of Thrones">Game of Thrones</option>
              </select>{" "}
              from Synchrony vendors.
            </span>
            <div className="flex mt-4">
              {!loading ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-md mt-2 block border-transparent bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-3 text-center font-medium text-white shadow hover:bg-gray-700"
                >
                  Get some results!
                </button>
              ) : (
                <div className="w-full mt-2 block rounded-md border-transparent bg-gradient-to-r from-orange-600 to-pink-500 px-4 py-3 text-center font-medium text-white shadow hover:bg-gray-700">
                  <div className="flex mx-auto w-full">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8  text-gray-200 animate-spin dark:text-gray-600 fill-white justify-center text-center align-middle mx-auto"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {openAIResponse ? (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {openAIResponse.map((product: any, index) => (
                  <a key={index} href={product.link} className="group">
                    <div className="aspect-h-1/2 aspect-w-1  overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                      <h3>{product.title}</h3>
                      {/* <h4>{product.source}</h4>
                      <h4>{product.price}</h4> */}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default Home;
