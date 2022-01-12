import { PAGINATION_QUERY } from '../components/Pagination';

export default function PaginationField() {
  return {
    keyArgs: false, // tells apollo we will handle things
    read(existing = [], { args, cache }) {
      // console.log(existing, args, cache);
      const { skip, first } = args;

      // First thing is to ask the read function for the items.
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      // console.log(data);
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check for existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // IF there are items and there aren't enough items to satisfy how many were requested
      // AND there aren't enough items to satisfy how many were requested
      // THEN JUST SEND IT!
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have items so we must go to the network to fetch them
        return false;
      }

      // if there are items, just return from the cache, and don't go to the network.
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache! Gonna send them to Apollo`
        // );
        return items;
      }

      // Or we can return the false from here (network request)
      return false; // fallback from network
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the apollo client comes back from the network with our products
      // console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // finally return the merged items from the cache
      return merged;
    },
  };
}
