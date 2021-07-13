package com.coupon.webapp.common.jooq;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// mirrored from org.jboss.dna.common.text.Inflector
// see https://docs.jboss.org/jbossdna/0.4/apidocs/src-html/org/jboss/dna/common/text/Inflector.html
public class Inflector {

    protected static final Inflector INSTANCE = new Inflector();

    public static Inflector getInstance() {
        return INSTANCE;
    }

    protected class Rule {
        protected final String expression;
        protected final Pattern expressionPattern;
        protected final String replacement;

        protected Rule(String expression, String replacement) {
            this.expression = expression;
            this.replacement = (replacement != null) ? replacement : "";
            this.expressionPattern = Pattern.compile(this.expression, Pattern.CASE_INSENSITIVE);
        }

        protected String apply(String input) {
            Matcher matcher = this.expressionPattern.matcher(input);
            if (!matcher.find()) {
                return null;
            }
            return matcher.replaceAll(this.replacement);
        }

        @Override
        public int hashCode() {
            return expression.hashCode();
        }

        @Override
        public boolean equals(Object object) {
            if (object == this) {
                return true;
            }
            if ((object != null) && (object.getClass() == this.getClass())) {
                final Rule that = (Rule) object;
                return this.expression.equalsIgnoreCase(that.expression);
            }
            return false;
        }

        @Override
        public String toString() {
            return this.expression + ", " + this.replacement;
        }
    }

    private LinkedList<Rule> plurals = new LinkedList<>();
    private LinkedList<Rule> singulars = new LinkedList<>();

    private final Set<String> uncountables = new HashSet<>();

    public Inflector() {
        initialize();
    }

    protected Inflector(Inflector original) {
        this.plurals.addAll(original.plurals);
        this.singulars.addAll(original.singulars);
        this.uncountables.addAll(original.uncountables);
    }

    @Override
    public Inflector clone() {
        return new Inflector(this);
    }

    public String singularize(Object word) {
        if (word == null) return null;
        String wordStr = word.toString().trim();
        if (wordStr.length() == 0) return wordStr;
        if (isUncountable(wordStr)) return wordStr;
        for (Rule rule : this.singulars) {
            String result = rule.apply(wordStr);
            if (result != null) return result;
        }
        return wordStr;
    }

    private boolean isUncountable(String word) {
        if (word == null) {
            return false;
        }
        String trimmedLower = word.trim().toLowerCase();
        return this.uncountables.contains(trimmedLower);
    }

    private void addPluralize(String rule, String replacement) {
        final Rule pluralizeRule = new Rule(rule, replacement);
        this.plurals.addFirst(pluralizeRule);
    }

    private void addSingularize(String rule, String replacement) {
        final Rule singularizeRule = new Rule(rule, replacement);
        this.singulars.addFirst(singularizeRule);
    }

    private void addIrregular(String singular, String plural) {
        String singularRemainder = singular.length() > 1 ? singular.substring(1) : "";
        String pluralRemainder = plural.length() > 1 ? plural.substring(1) : "";
        addPluralize("(" + singular.charAt(0) + ")" + singularRemainder + "$", "$1" + pluralRemainder);
        addSingularize("(" + plural.charAt(0) + ")" + pluralRemainder + "$", "$1" + singularRemainder);
    }

    private void addUncountable(String... words) {
        if ((words == null) || (words.length == 0)) {
            return;
        }
        for (String word : words) {
            if (word != null) {
                uncountables.add(word.trim().toLowerCase());
            }
        }
    }

    private void initialize() {
        Inflector inflect = this;
        inflect.addPluralize("$", "s");
        inflect.addPluralize("s$", "s");
        inflect.addPluralize("(ax|test)is$", "$1es");
        inflect.addPluralize("(octop|vir)us$", "$1i");
        inflect.addPluralize("(octop|vir)i$", "$1i"); // already plural
        inflect.addPluralize("(alias|status)$", "$1es");
        inflect.addPluralize("(bu)s$", "$1ses");
        inflect.addPluralize("(buffal|tomat)o$", "$1oes");
        inflect.addPluralize("([ti])um$", "$1a");
        inflect.addPluralize("([ti])a$", "$1a"); // already plural
        inflect.addPluralize("sis$", "ses");
        inflect.addPluralize("(?:([^f])fe|([lr])f)$", "$1$2ves");
        inflect.addPluralize("(hive)$", "$1s");
        inflect.addPluralize("([^aeiouy]|qu)y$", "$1ies");
        inflect.addPluralize("(x|ch|ss|sh)$", "$1es");
        inflect.addPluralize("(matr|vert|ind)ix|ex$", "$1ices");
        inflect.addPluralize("([m|l])ouse$", "$1ice");
        inflect.addPluralize("([m|l])ice$", "$1ice");
        inflect.addPluralize("^(ox)$", "$1en");
        inflect.addPluralize("(quiz)$", "$1zes");
        // Need to check for the following words that are already pluralized:
        inflect.addPluralize("(people|men|children|sexes|moves|stadiums)$", "$1"); // irregulars
        inflect.addPluralize("(oxen|octopi|viri|aliases|quizzes)$", "$1"); // special rules

        inflect.addSingularize("s$", "");
        inflect.addSingularize("(s|si|u)s$", "$1s"); // '-us' and '-ss' are already singular
        inflect.addSingularize("(n)ews$", "$1ews");
        inflect.addSingularize("([ti])a$", "$1um");
        inflect.addSingularize("((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$", "$1$2sis");
        inflect.addSingularize("(^analy)ses$", "$1sis");
        inflect.addSingularize("(^analy)sis$", "$1sis"); // already singular, but ends in 's'
        inflect.addSingularize("([^f])ves$", "$1fe");
        inflect.addSingularize("(hive)s$", "$1");
        inflect.addSingularize("(tive)s$", "$1");
        inflect.addSingularize("([lr])ves$", "$1f");
        inflect.addSingularize("([^aeiouy]|qu)ies$", "$1y");
        inflect.addSingularize("(s)eries$", "$1eries");
        inflect.addSingularize("(m)ovies$", "$1ovie");
        inflect.addSingularize("(x|ch|ss|sh)es$", "$1");
        inflect.addSingularize("([m|l])ice$", "$1ouse");
        inflect.addSingularize("(bus)es$", "$1");
        inflect.addSingularize("(o)es$", "$1");
        inflect.addSingularize("(shoe)s$", "$1");
        inflect.addSingularize("(cris|ax|test)is$", "$1is"); // already singular, but ends in 's'
        inflect.addSingularize("(cris|ax|test)es$", "$1is");
        inflect.addSingularize("(octop|vir)i$", "$1us");
        inflect.addSingularize("(octop|vir)us$", "$1us"); // already singular, but ends in 's'
        inflect.addSingularize("(alias|status)es$", "$1");
        inflect.addSingularize("(alias|status)$", "$1"); // already singular, but ends in 's'
        inflect.addSingularize("^(ox)en", "$1");
        inflect.addSingularize("(vert|ind)ices$", "$1ex");
        inflect.addSingularize("(matr)ices$", "$1ix");
        inflect.addSingularize("(quiz)zes$", "$1");

        inflect.addIrregular("person", "people");
        inflect.addIrregular("man", "men");
        inflect.addIrregular("child", "children");
        inflect.addIrregular("sex", "sexes");
        inflect.addIrregular("move", "moves");
        inflect.addIrregular("stadium", "stadiums");

        inflect.addUncountable("equipment", "information", "rice", "money", "species", "series", "fish", "sheep");
    }

}
