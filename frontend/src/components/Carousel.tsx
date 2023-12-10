import React, { CSSProperties } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; // Import if using React Router for navigation
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style,
        display: "block",
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translate(0, -50%)",
        background: "rgba(0, 0, 0, 0.5)",
        width: "50px", // Width of the clickable area
        height: "100%",
        zIndex: 1
      }}
      onClick={onClick}
    >
      {/* <div
        style={{
          position: "relative",
          // left: "100px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "grey",
          borderRadius: "50%",
          padding: "10px"
        }} */}
      {/* > */}
        {/* Arrow icon here */}
             {/* <img src="/public/icons/1x/baseline_arrow_forward_black_48dp.png" alt="Next" style={{ width: "100%", height: "100%" }} /> */}

      {/* </div> */}
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style,
        display: "block",
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translate(0, -50%)",
        background: "rgba(0, 0, 0, 0.5)",
        width: "50px", // Width of the clickable area
        height: "100%",
        zIndex: 1
      }}
      onClick={onClick}
    >
      {/* <div
        style={{
          position: "relative",
          // right: "1px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "grey",
          borderRadius: "50%",
          padding: "10px"
        }}
      >
          <img src="public/icons/baseline_arrow_back_black_24dp.png" alt="Next" style={{ width: "100%", height: "100%" }} />
      </div> */}
    </div>
  );
}



const cardStyle: CSSProperties = {
  maxWidth: '80%', // Adjust width for responsiveness
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: '#fff',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  // You can tweak this one
  margin: '0 10px', // Add horizontal margin
};

const titleStyle: CSSProperties = {
  margin: '5px 0 1px', // Adjust top and bottom margins as needed
  // ... other title styles ...
};

const descriptionStyle: CSSProperties = {
  margin: '5px 0', // Adjust top and bottom margins as needed
  // ... other description styles ...
};


const imageStyle: CSSProperties = {
  width: '100%', // Adjust width for responsiveness
  height: '150px',
  // objectFit: 'cover'
  objectFit: 'cover' // Adjust the image size to contain the area
};
// const imageStyle: CSSProperties = {
//   width: 'auto', // Full width of the card
//   height: 'auto',
//   maxHeight: '150px', // Fixed height for the image
//   objectFit: 'cover' // Adjust the image size to cover the area
// };

const CarouselComponent = () => {
  const settings = {
    dots: true,
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show fewer slides on smaller screens
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show only one slide on very small screens
          slidesToScroll: 1,
          adaptiveHeight: true,
        }
      },
      {
        breakpoint: 400, // Additional breakpoint for very small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: true
        }
      }
    ]
  };
// }
  // const settings = {
  //   dots: true,
  //   // infinite: true,
  //   // speed: 500,
  //   // slidesToShow: 3,
  //   // slidesToScroll: 3,
  //   className: "center",
  //   centerMode: true,
  //   infinite: true,
  //   centerPadding: "60px",
  //   slidesToShow: 3,
  //   speed: 500,
  //   nextArrow: <SampleNextArrow />,
  //   prevArrow: <SamplePrevArrow />,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         infinite: true,
  //         dots: true
  //       }
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //         initialSlide: 2
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1
  //       }
  //     }
  //   ]
// };

  // Define an array of projects (can be fetched from an API or defined statically)
  const projects = [
    { title: "FileTransfert", 
      description: "Giving the possibility to the user to have a personnal space where they can save notes/images/light weight data",
      link: "/project1",
      imageUrl: "/images/WIP.jpg" 
    },

    { title: "Obsidian Integration", 
      description: "Making an Obsidian plugin to take notes while browsing the content", 
      link: "/project2",
      imageUrl: "/images/WIP.jpg" 
    },
    { title: "ChatGpt integration", description: " Making a chat-gpt plugin that will for now be used to answer the User basics question on everything", link: "/project3",      imageUrl: "/public/images/WIP.jpg" 
  },
    { title: "More articles?", description: "IDK for now I'm happy with this for now, maybe an app, probably getting familiar with an other API?", link: "/project4",       imageUrl: "/public/images/WIP.jpg" 
  },
    // Add more projects as needed
  ];

  return (
    <div style={{ margin: '0 auto', maxWidth: '100%' }}>
      <h2>Incoming Features and Projects</h2>
      <Slider {...settings}>
        {projects.map((project, index) => (
          <div key={index} style={{ padding: '5px' }}>
            <Link to={project.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={cardStyle}>
                <img src={project.imageUrl} alt={project.title} style={imageStyle} />
                <h3 style={titleStyle}>{project.title}</h3>
                <p style={descriptionStyle}>{project.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};
    //     <div style={{ margin: '0 auto', maxWidth: '100%' }}>
//       <h2>Incoming Features and Projects</h2>
//       <Slider {...settings}>
//         {projects.map((project, index) => (
//           <div key={index} style={{ padding: '5px' }}>
//             <Link to={project.link} style={{ textDecoration: 'none', color: 'inherit' }}>
//               <div style={cardStyle}>
//                 <img src={project.imageUrl} alt={project.title} style={imageStyle} />
//                 <h3 style={titleStyle}>{project.title}</h3>
//                 <p style={descriptionStyle}>{project.description}</p>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

export default CarouselComponent;

// Yeah the arrow zone is ugly. Maybe do it later, old arrow code
// but that was somehow uglier.
// OLD ARROW CODE:
// function SampleNextArrow(props: any) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: "block",
//         background: "rgba(0, 0, 0, 0.5)",
//         borderRadius: "50%",
//         padding: "10px",
//         right: "25px", // Position adjustment
//         zIndex: 1
//       }}
//       onClick={onClick}
//     >
//       {/* You can use an icon or an image here */}
//       <img src="/public/icons/1x/baseline_arrow_forward_black_48dp.png" alt="Next" style={{ width: "100%", height: "100%" }} />
//       {/* <span style={{ fontSize: "20px", color: "white" }}>›</span> */}
//     </div>
//   );
// }

// function SamplePrevArrow(props: any) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: "block",
//         background: "rgba(0, 0, 0, 0.5)",
//         borderRadius: "50%",
//         padding: "10px",
//         left: "25px", // Position adjustment
//         zIndex: 1
//       }}
//       onClick={onClick}
//     >
//       <img src="public/icons/baseline_arrow_back_black_24dp.png" alt="Next" style={{ width: "100%", height: "100%" }} />
//       {/* <span style={{ fontSize: "20px", color: "white" }}>‹</span> */}
//     </div>
//   );
// }
