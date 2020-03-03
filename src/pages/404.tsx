/** @jsx jsx */
import { jsx, useThemeUI, Styled as s } from "theme-ui";
import { Illustration, Ellipse, Shape, Group } from "zdog";
import { useLayoutEffect, useRef, useEffect } from "react";
import { Link } from "gatsby";
import { PageLayout } from "../layouts/PageLayout";
import { Seo } from "../components/Seo";
import { ExactTheme } from "../components";

function useMousePositionRef() {
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      position.current = {
        x: event.pageX / window.innerWidth - 0.5,
        y: event.pageY / window.innerHeight - 0.5,
      };
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  return position;
}

// TODO: Test if it affects bundle size on other pages
const FourOhFourPage = () => {
  const { colors, styles } = useThemeUI().theme as ExactTheme;
  const svgElement = useRef<SVGSVGElement>(null);
  const mousePos = useMousePositionRef();

  useLayoutEffect(() => {
    if (!svgElement.current) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    let wasDragged = false;
    const color = colors.text092;
    const stroke = 30;

    const illustration = new Illustration({
      element: svgElement.current,
      dragRotate: true,
      onDragStart() {
        wasDragged = true;
      },
    });

    illustration.addChild(
      new Ellipse({
        diameter: 110,
        width: 80,
        stroke,
        color,
      })
    );

    const first4 = new Group({
      addTo: illustration,
      translate: { x: -120 },
    });

    first4.addChild(
      new Shape({
        path: [
          { x: -12, y: -55 },
          { x: -35, y: 25 },
          { x: 35, y: 25 },
        ],
        closed: false,
        stroke,
        color,
      })
    );
    first4.addChild(
      new Shape({
        path: [
          { x: 22, y: -13 },
          { x: 22, y: 52 },
        ],
        closed: false,
        stroke,
        color,
      })
    );

    first4.copyGraph({ addTo: illustration, translate: { x: 120 } });

    let handle: number;
    function animate() {
      if (!wasDragged) {
        const { x, y } = mousePos.current;
        illustration.rotate.set({
          x: -y * Math.PI * 0.321,
          y: -x * Math.PI * 0.321,
        });
      }
      handle = requestAnimationFrame(animate);
      illustration.updateRenderGraph();
    }
    animate();

    return () => {
      cancelAnimationFrame(handle);
    };
  }, [colors, mousePos]);

  return (
    <PageLayout>
      <Seo titleTemplate="%s" />
      <main>
        <svg
          ref={svgElement}
          width={400}
          height={400}
          preserveAspectRatio="xMidYMid meet"
          sx={{
            cursor: "move",
            width: "100%",
            height: "auto",
          }}
        />
        <s.p>
          Oops! I couldn't find this page.
          <br />
          <s.a
            href={`https://twitter.com/messages/compose?recipient_id=754073418446671873&text=${encodeURIComponent(
              `Hey, I'm on 404 page on your website on ${window.location.href}. This is probably a screw-up.`
            )}`}
          >
            DM me
          </s.a>{" "}
          if you think a page should be there. Otherwise, go back to{" "}
          <Link to="/" sx={styles.a}>
            home
          </Link>
          .
        </s.p>
      </main>
    </PageLayout>
  );
};

export default FourOhFourPage;
