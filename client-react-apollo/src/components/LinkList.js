import React from "react";
import Link from "./Link";
import {useQuery, gql} from "@apollo/client";

const FEED_QUERY = gql `{
    feed {
      count
      links {
        id
        description
        url
        createdAt
      }
    }
  }`

  // So! this is how you do it. Resolver functions on the backend, and using gql / useQuery hooks on the frontend. This routes through apollo, which then connects to the GQL server.
  // Best practice for coming up with queries - since it has to match your schema anyway, use the graphql playground to test the query you want to use, then copy everything past the greyed out text. 

function LinkList() {


const {data} = useQuery(FEED_QUERY)

  return (
    <div>
        {data && (
            <>
            {data.feed.links.map((link) => (
                <Link key={link.id} link={link}/>
            ))}
            </>
        )}
    </div>
  );
};

export default LinkList;