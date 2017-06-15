package cz.cvut.kbss.reporting.util;

import javax.swing.text.BadLocationException;
import javax.swing.text.Document;
import javax.swing.text.StyledEditorKit;
import javax.swing.text.html.HTMLEditorKit;
import javax.swing.text.rtf.RTFEditorKit;
import java.io.*;

/**
 * Created by Bogdan Kostov on 5/31/2017.
 */
public class DocConverter {
    // TODO - add logger and log messages
    protected StyledEditorKit htmlKit = new HTMLEditorKit();
    protected StyledEditorKit rtfKit = new RTFEditorKit();
//    protected StyledEditorKit txtKit = new EditorKit();


    public String convertHtml2Rtf(String html){
        return convertImpl(html, htmlKit, rtfKit);
    }

    public String convertHtml2PlainText(String hmtl){
        return convert2PlainTextImpl(hmtl, htmlKit);
    }

    public String convertRtf2Html(String rtf){
        return convertImpl(rtf, rtfKit, htmlKit);
    }

    public String convertRtf2PlainText(String rtf){
        return convert2PlainTextImpl(rtf, rtfKit);
    }


    protected String convert2PlainTextImpl(String toConvert, StyledEditorKit fromKit) {
        Document doc = convert2DocumentImpl(toConvert, fromKit);
        if(doc == null)
            return null;
        try {
            return doc.getText(0, doc.getLength());
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
        return null;
    }

    protected String convertImpl(String toConvert, StyledEditorKit fromKit, StyledEditorKit toKit){
        Document doc = convert2DocumentImpl(toConvert, fromKit);//fromKit.createDefaultDocument();
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            toKit.write(bos, doc,0, doc.getLength());
            return bos.toString(Constants.UTF_8_ENCODING);
        } catch (BadLocationException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    protected Document convert2DocumentImpl(String toConvert, StyledEditorKit fromKit) {
        Document doc = fromKit.createDefaultDocument();
        Reader reader = new StringReader(toConvert);
        try {
            fromKit.read(reader, doc, 0);
            return doc;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BadLocationException e) {
            e.printStackTrace();
        }
        return null;
    }

}

