import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, redirect, Link } from "react-router-dom";
import { Box, Grid, Pagination, PaginationItem } from "@mui/material";
// import { ArrowBackIcon, ArrowForwardIcon } from "@mui/icons-material";
import "../App.css";
// import getEventIds from "../../../data-service/eventId/EventID.js";
import EventOfDateCard from "./EventOfDateCard";

const event_ids = [
  698662738057, 691696692427, 476192744317, 502844430227, 639071970467,
  677631703667, 624779902507, 728981502297, 706738683427, 737622016307,
  491089340437, 626746825627, 462627941627, 684348904997, 691785989517,
  629706598387, 607850185267, 637597299687, 633557235747, 714367110257,
  472855071247, 563786710227, 707186573077, 693700335377, 692878747987,
  663091082277, 723443357557, 502645976647, 694266308217, 512955964097,
  729991613567, 693376346317, 677911069257, 511300201667, 738864773427,
  470613546787, 696082069207, 737131950507, 682258663027, 668363231417,
  680166906527, 692205103097, 708340705117, 691227689627, 691157760467,
  472829063457, 561470582627, 716279921527, 690593282097, 676293059747,
  544990700857, 629384013527, 723812060357, 692820182817, 698744332107,
  502697029347, 714122879757, 714917576717, 523289802887, 662490987377,
  490810355987, 681995686457, 715046111167, 649732937707, 695478824887,
  474768735067, 474966295977, 682397287657, 729475279197, 692751457257,
  694988889477, 693741799397, 716729736937, 724223149937, 632870140627,
  476190357177, 705998740237, 728024339397, 742953232117, 694153089577,
  604021744297, 570081277447, 392543116027, 673110641047, 696202048067,
  473571885257, 729790271347, 717412850147, 364418414287, 563768786617,
  631668185547, 547886331767, 586101273687, 743950876097, 541900357557,
  419565580947, 404312649017, 701524457537, 392809733487, 544985585557,
  660396723377, 723753124077, 737760801417, 695440941577, 710267247457,
  624780454157, 471759424137, 586841668227, 500908570017, 729359543027,
  605066077927, 722574298177, 723969160247, 733645372057, 707997428367,
  705098016147, 492205809827, 715519176117, 586094944757, 720176125177,
  721564126727, 676291685637, 697951982167, 682149847557, 471608994197,
  723702021227, 716125158627, 412916142297, 710480134207, 620110365797,
  710499762917, 621811764727, 681965245407, 707844119817, 684349657247,
  714345244857, 713913894677, 666204825567, 696231104977, 676291775907,
  491806405197, 704652814537, 487856691497, 696134275357, 681230547907,
  710881976127, 668511073617, 633563534587, 681520114007, 476192142517,
  686869564357, 744675623837, 738317406237, 456491818317, 700614495817,
  565505380817, 696166692317, 692548901407, 495950279637, 698713740607,
  681963660667, 719411518217, 469118434867, 547714116667, 483647702297,
  670903900627, 626631109517, 529016371207, 688188298727, 472702244137,
  717789356287, 714036381037, 728513833487, 717936646837, 709825205297,
  714298414787, 642376243637, 738674153277, 707877248907, 706362488217,
  709511827977, 699928694567, 714801429317, 714811780277, 491450982117,
  536598950907, 689330936387, 707819034787, 544979928637, 718856829127,
  507992899437, 708694242557, 718529299477, 723738710967, 146584912419,
  623101632757, 707351847417, 682154120337, 719285852347, 681029897757,
];

function EventOfDate() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")));

  let cardsData = null;
  let pageDisplay = 20;
  let lastPage = Math.ceil(event_ids.length / pageDisplay);
  console.log(lastPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
    if (currentPage < 0) {
      return redirect(`events/date/?page=1`);
    } else if (currentPage > lastPage) {
      return redirect(`events/date/?page=${lastPage}`);
    }
    return redirect(`events/date/?page=${value}`);
  };

  //   useEffect(() => {
  //     setCurrentPage(searchParams.get("page"));
  //   }, [currentPage]);
  //   require to add useEffect when the event_ids changed

  cardsData =
    event_ids &&
    event_ids
      .slice(pageDisplay * (currentPage - 1), pageDisplay * currentPage)
      .map((id) => {
        return <EventOfDateCard eventId={id} key={id} />;
      });
  console.log(Math.ceil(event_ids.length / pageDisplay));
  return (
    <section className="event-by-date-section">
      <div className="event-by-date-div">
        <Grid
          container
          spacing={1}
          sx={{
            marginTop: "3%",
            marginBottom: "1%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            maxWidth: "auto",
            maxHeight: "auto",
            alignItems: "center",
            flexGrow: 1,
            flexBasis: 0,
            overflow: "auto",
          }}
        >
          {cardsData}
        </Grid>
        <Box
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          sx={{ marginRight: "6%" }}
        >
          <Pagination
            page={currentPage}
            count={lastPage}
            onChange={handleChange}
            sx={{ marginBottom: "1%", marginTop: "1%" }}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`?page=${item.page}`}
                {...item}
              />
            )}
          />
        </Box>
      </div>
    </section>
  );
}

export default EventOfDate;
